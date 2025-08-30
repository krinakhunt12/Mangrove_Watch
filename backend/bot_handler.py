import logging
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, ContextTypes, filters
from geopy.geocoders import Nominatim
from full_pipe import Pipeline   # <-- use pipeline instead of direct satellite call

# --------------------------
# Logging
# --------------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --------------------------
# Load BOT TOKEN
# --------------------------
BOT_TOKEN = "8453666313:AAEzpPpLHifihOksnuHW8HD3KZlF2nheYW8"  # <---- replace with your token!

# Initialize pipeline
pipeline = Pipeline()

# --------------------------
# Start command
# --------------------------
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "👋 Hello! I am your Agro Guardian bot.\n\n"
        "You can:\n"
        "📍 Send a location name (e.g., 'Ahmedabad')\n"
        "📍 Send coordinates (e.g., '21.17, 72.83')\n\n"
        "I will check 🛰️ satellite vegetation change."
    )

# --------------------------
# Handle text input (location name / coordinates)
# --------------------------
async def handle_text(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = update.message.text.strip()
    logger.info(f"[User Input] {text}")

    lat, lon = None, None

    # Case 1: Coordinates given
    if "," in text:
        try:
            parts = text.split(",")
            lat = float(parts[0].strip())
            lon = float(parts[1].strip())
        except:
            await update.message.reply_text("⚠️ Invalid coordinates format. Try: 21.17, 72.83")
            return

    # Case 2: Place name (convert via geocoding)
    else:
        geolocator = Nominatim(user_agent="agro_guardian_bot")
        try:
            location = geolocator.geocode(text, timeout=10)
        except Exception as e:
            await update.message.reply_text("⚠️ Geocoding service timeout. Please try again.")
            logger.error(f"Geocoding error: {e}")
            return

        if location:
            lat, lon = location.latitude, location.longitude
        else:
            await update.message.reply_text("❌ Could not find that location. Try again.")
            return

    # Run full pipeline on coordinates
    result = pipeline.run_on_coordinates(lat, lon)
    veg_change = result.get("satellite_vegetation_change", "N/A")

    await update.message.reply_text(
        f"📍 Location: {lat}, {lon}\n🛰️ Vegetation Change: {veg_change}%"
    )

# --------------------------
# Main
# --------------------------
def main():
    app = Application.builder().token(BOT_TOKEN).build()

    # Commands
    app.add_handler(CommandHandler("start", start))

    # Messages
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_text))

    logger.info("✅ Telegram bot is running...")
    app.run_polling()

if __name__ == "__main__":
    main()
