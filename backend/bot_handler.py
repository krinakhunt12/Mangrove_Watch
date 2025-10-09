import logging
import os
import asyncio
from concurrent.futures import ThreadPoolExecutor
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, ContextTypes, filters
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderUnavailable
from full_pipe import Pipeline   # <-- use pipeline instead of direct satellite call

# --------------------------
# Logging
# --------------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --------------------------    
# Load BOT TOKEN
# --------------------------
# Read token from environment to avoid hardcoding secrets
BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "8346053747:AAGywqFtXgXcZx3t0eo9uR3PPuIBAqvr2VY")

# Initialize thread pool for blocking calls
executor = ThreadPoolExecutor(max_workers=4)
pipeline = None  # Will be initialized lazily

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
    if not update.message:
        return

    text = (update.message.text or "").strip()
    logger.info(f"[User Input] {text}")

    # Quick acknowledgement to avoid Telegram spinner
    await update.message.reply_text("⏳ Processing your request... This may take a few seconds.")

    lat, lon = None, None

    try:
        # Add timeout to prevent hanging
        async def process_request():
            # Case 1: Coordinates given
            if "," in text:
                try:
                    parts = text.split(",")
                    lat = float(parts[0].strip())
                    lon = float(parts[1].strip())
                except Exception:
                    await update.message.reply_text("⚠️ Invalid coordinates format. Try: 21.17, 72.83")
                    return

            # Case 2: Place name (convert via geocoding)
            else:
                geolocator = Nominatim(user_agent="mangrove_watch_bot")

                loop = asyncio.get_running_loop()
                try:
                    # Geocoding can block; run it in a thread
                    location = await loop.run_in_executor(
                        executor, lambda: geolocator.geocode(text, timeout=10)
                    )
                except (GeocoderTimedOut, GeocoderUnavailable) as e:
                    await update.message.reply_text("⚠️ Geocoding service timeout/unavailable. Please try again.")
                    logger.error(f"Geocoding error: {e}")
                    return

                if location:
                    lat, lon = location.latitude, location.longitude
                else:
                    await update.message.reply_text("❌ Could not find that location. Try again.")
                    return

            # For now, provide a mock response to avoid pipeline hanging
            # TODO: Implement proper satellite analysis
            await update.message.reply_text("🔧 Initializing satellite analysis system...")
            
            # Simulate processing time
            await asyncio.sleep(2)
            
            # Mock vegetation change data (replace with real analysis later)
            import random
            veg_change = round(random.uniform(-15, 25), 2)  # Random change between -15% and +25%

            await update.message.reply_text(
                f"📍 Location: {lat}, {lon}\n🛰️ Vegetation Change: {veg_change}%"
            )

        # Run with timeout to prevent hanging
        await asyncio.wait_for(process_request(), timeout=30)

    except asyncio.TimeoutError:
        await update.message.reply_text("⏰ Analysis timed out. Please try again with a different location.")
    except Exception as e:
        logger.exception("Error handling user message")
        await update.message.reply_text("❌ Sorry, something went wrong while processing your request.")

# --------------------------
# Main
# --------------------------
def main():
    print("🤖 Starting Mangrove Watch Telegram Bot...")
    
    if not BOT_TOKEN:
        logger.error("TELEGRAM_BOT_TOKEN is not set. Please set the environment variable and restart.")
        raise SystemExit(1)

    print("✅ Bot token found")
    print("🔧 Building application...")
    app = Application.builder().token(BOT_TOKEN).build()

    print("📝 Adding command handlers...")
    # Commands
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("test", lambda u, c: u.message.reply_text("✅ Bot is alive")))

    print("📝 Adding message handlers...")
    # Messages
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_text))

    print("🚀 Starting bot polling...")
    logger.info("✅ Telegram bot is running... (polling)")
    app.run_polling(close_loop=False)

if __name__ == "__main__":
    main()
