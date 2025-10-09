#!/usr/bin/env python3

import logging
import asyncio
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, ContextTypes, filters
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderUnavailable

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Bot token
BOT_TOKEN = "8346053747:AAGywqFtXgXcZx3t0eo9uR3PPuIBAqvr2VY"

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Start command handler"""
    await update.message.reply_text(
        "👋 Hello! I am your Mangrove Watch bot.\n\n"
        "You can:\n"
        "📍 Send a location name (e.g., 'Ahmedabad')\n"
        "📍 Send coordinates (e.g., '21.17, 72.83')\n\n"
        "I will check 🛰️ satellite vegetation change."
    )

async def test(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Test command handler"""
    await update.message.reply_text("✅ Bot is alive and working!")

async def handle_text(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle text messages"""
    if not update.message:
        return

    text = (update.message.text or "").strip()
    logger.info(f"[User Input] {text}")

    # Quick acknowledgement
    await update.message.reply_text("⏳ Processing your request... This may take a few seconds.")

    try:
        lat, lon = None, None

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
            try:
                location = await asyncio.wait_for(
                    asyncio.get_event_loop().run_in_executor(
                        None, lambda: geolocator.geocode(text, timeout=10)
                    ),
                    timeout=15
                )
            except (GeocoderTimedOut, GeocoderUnavailable) as e:
                await update.message.reply_text("⚠️ Geocoding service timeout/unavailable. Please try again.")
                logger.error(f"Geocoding error: {e}")
                return
            except asyncio.TimeoutError:
                await update.message.reply_text("⏰ Geocoding timed out. Please try again.")
                return

            if location:
                lat, lon = location.latitude, location.longitude
            else:
                await update.message.reply_text("❌ Could not find that location. Try again.")
                return

        # Simulate satellite analysis
        await update.message.reply_text("🔧 Initializing satellite analysis system...")
        await asyncio.sleep(2)  # Simulate processing time
        
        # Mock vegetation change data
        import random
        veg_change = round(random.uniform(-15, 25), 2)
        
        # Determine status based on change
        if veg_change > 10:
            status = "📈 Significant vegetation increase"
        elif veg_change > 0:
            status = "📊 Moderate vegetation increase"
        elif veg_change > -10:
            status = "📉 Moderate vegetation decrease"
        else:
            status = "📉 Significant vegetation decrease"

        await update.message.reply_text(
            f"📍 Location: {lat}, {lon}\n"
            f"🛰️ Vegetation Change: {veg_change}%\n"
            f"📊 Status: {status}\n\n"
            f"ℹ️ This is a demo response. Real satellite analysis will be implemented soon."
        )

    except Exception as e:
        logger.exception("Error handling user message")
        await update.message.reply_text("❌ Sorry, something went wrong while processing your request.")

def main():
    print("🤖 Starting Mangrove Watch Telegram Bot...")
    
    if not BOT_TOKEN:
        print("❌ No bot token found")
        return

    print("✅ Bot token found")
    print("🔧 Building application...")
    app = Application.builder().token(BOT_TOKEN).build()

    print("📝 Adding command handlers...")
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("test", test))

    print("📝 Adding message handlers...")
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_text))

    print("🚀 Starting bot polling...")
    logger.info("✅ Telegram bot is running... (polling)")
    
    try:
        app.run_polling()
    except KeyboardInterrupt:
        print("Bot stopped by user")

if __name__ == "__main__":
    main()

