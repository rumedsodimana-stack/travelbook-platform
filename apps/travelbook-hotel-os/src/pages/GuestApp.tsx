import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import {
  Home, RotateCcw, Zap, Sparkles, MessageCircle, ShoppingBag,
  Cloud, Droplets, Lightbulb, Wind, Lock, Bell, Plus, FileText,
  Star, MapPin, Wifi, Utensils, Dumbbell, Waves, Users, Calendar,
  Clock, ChevronRight, Send, Mic, X, Volume2, Coffee, UtensilsCrossed,
  Wine, Bed, BarChart3
} from "lucide-react";

export function GuestApp() {
  const [activeTab, setActiveTab] = useState<"stay" | "room" | "concierge" | "book">("stay");
  const [roomTemp, setRoomTemp] = useState(22);
  const [brightness, setBrightness] = useState(75);
  const [dnd, setDnd] = useState(false);
  const [showHousekeepingModal, setShowHousekeepingModal] = useState(false);
  const [housekeepingItems, setHousekeepingItems] = useState<string[]>([]);
  const [housekeepingNotes, setHousekeepingNotes] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; text: string }>>([]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [lightingScene, setLightingScene] = useState("Work");

  const guestName = "James";
  const roomNumber = "412";
  const roomType = "Presidential Suite";
  const checkIn = "2026-04-01";
  const checkOut = "2026-04-05";
  const nights = 4;

  const quickReplies = [
    "What's for breakfast?",
    "Book a spa session",
    "Request late checkout",
    "Local recommendations",
    "Contact front desk"
  ];

  const aiResponses: Record<string, string> = {
    "What's for breakfast?": "Breakfast is served from 6:30 AM to 11:00 AM in the main restaurant. Today we're featuring a European buffet with fresh pastries, organic fruits, and our signature Arabic spreads. Would you like me to make a reservation for you?",
    "Book a spa session": "I'd be happy to help! Our spa offers several options: Swedish Massage (60 min, BHD 85), Hammam Experience (45 min, BHD 65), or a Full Wellness Package (120 min, BHD 140). What time works best for you?",
    "Request late checkout": "Late checkout is available! You can extend to 2 PM for BHD 35 or 4 PM for BHD 60. I've initiated your request — the front desk will confirm shortly.",
    "Local recommendations": "In Manama, I recommend the Souq (traditional market), Bab Al Bahrain historic fort, or the Bahrain National Museum. For dining, try Bushido for Japanese or Al Waha for authentic Bahraini cuisine.",
    "Contact front desk": "Connecting you with the front desk now. They'll call your room within 2 minutes, or would you prefer I send them a message?"
  };

  const handleQuickReply = (reply: string) => {
    const newMessage = { role: "guest", text: reply };
    setChatMessages([...chatMessages, newMessage]);
    setIsTyping(true);
    setTimeout(() => {
      const response = { role: "aria", text: aiResponses[reply] || "How can I help?" };
      setChatMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const newMessage = { role: "guest", text: chatInput };
    setChatMessages([...chatMessages, newMessage]);
    setChatInput("");
    setIsTyping(true);
    setTimeout(() => {
      const response = { role: "aria", text: "I'm here to help! Is there anything specific I can assist you with?" };
      setChatMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-50 flex items-center justify-center p-4">
      {/* Mobile Container */}
      <div className="w-full max-w-[430px] bg-white rounded-3xl shadow-2xl border border-violet-100 overflow-hidden flex flex-col h-screen max-h-[100vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold">Singularity Grand</h1>
          </div>
          {guestName && <p className="text-violet-100">Welcome back, {guestName}</p>}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* MY STAY TAB */}
            {activeTab === "stay" && (
              <motion.div key="stay" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-4 space-y-4">
                {/* Reservation Card */}
                <div className="bg-gradient-to-br from-violet-100 to-indigo-100 rounded-2xl p-5 border border-violet-200">
                  <p className="text-xs font-semibold text-violet-700 uppercase tracking-wide mb-2">Your Reservation</p>
                  <div className="flex items-baseline justify-between mb-4">
                    <h2 className="text-4xl font-bold text-gray-900">{roomNumber}</h2>
                    <span className="text-sm font-medium text-gray-700">{roomType}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div><p className="text-gray-600">Check-in</p><p className="font-semibold text-gray-900">Apr 1</p></div>
                    <div><p className="text-gray-600">Check-out</p><p className="font-semibold text-gray-900">Apr 5</p></div>
                    <div><p className="text-gray-600">Nights</p><p className="font-semibold text-gray-900">{nights}</p></div>
                  </div>
                </div>

                {/* Weather Widget */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Manama, Bahrain</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">31°C</p>
                      <p className="text-xs text-gray-500 mt-1">Sunny & Clear</p>
                    </div>
                    <Cloud className="w-12 h-12 text-amber-400" />
                  </div>
                </div>

                {/* Quick Services */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Room Service", icon: Utensils, color: "from-orange-400 to-red-500" },
                    { label: "Housekeeping", icon: RotateCcw, color: "from-blue-400 to-cyan-500" },
                    { label: "Spa Booking", icon: Waves, color: "from-pink-400 to-rose-500" },
                    { label: "Restaurant", icon: UtensilsCrossed, color: "from-amber-400 to-orange-500" },
                    { label: "Late Checkout", icon: Clock, color: "from-indigo-400 to-violet-500" },
                    { label: "Concierge", icon: Star, color: "from-yellow-400 to-amber-500" }
                  ].map((service, i) => (
                    <button key={i} className={cn("bg-gradient-to-br p-3 rounded-xl text-white flex flex-col items-center gap-2 hover:shadow-md transition-shadow", `${service.color}`)}>
                      <service.icon className="w-5 h-5" />
                      <span className="text-xs font-medium text-center">{service.label}</span>
                    </button>
                  ))}
                </div>

                {/* Today's Events */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm">Today's Highlights</h3>
                  <div className="space-y-2">
                    {[
                      { time: "6:30 AM", event: "Breakfast Service Starts" },
                      { time: "10:00 AM", event: "Pool Opens" },
                      { time: "7:00 PM", event: "Evening Entertainment" }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-3 text-xs">
                        <Clock className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900">{item.time}</p>
                          <p className="text-gray-600">{item.event}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Loyalty Card */}
                <div className="bg-gradient-to-r from-amber-400 to-amber-600 rounded-2xl p-4 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <Star className="w-5 h-5" />
                    <span className="text-xs font-bold tracking-widest">GOLD MEMBER</span>
                  </div>
                  <p className="text-sm font-semibold">You have 2,450 points</p>
                  <p className="text-xs text-amber-50 mt-1">450 points to reach Platinum</p>
                </div>
              </motion.div>
            )}

            {/* ROOM CONTROLS TAB */}
            {activeTab === "room" && (
              <motion.div key="room" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-4 space-y-4">
                <h2 className="text-lg font-bold text-gray-900">Your Room · {roomNumber}</h2>

                {/* Temperature Control */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-blue-700 font-semibold uppercase">Temperature</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{roomTemp}°C</p>
                    </div>
                    <Wind className="w-8 h-8 text-blue-500" />
                  </div>
                  <div className="flex gap-2 mb-4">
                    {["Cool", "Heat", "Fan", "Auto"].map(mode => (
                      <button key={mode} className="flex-1 px-2 py-2 rounded-lg text-xs font-medium bg-white border border-blue-200 text-gray-700 hover:bg-blue-50">
                        {mode}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setRoomTemp(Math.max(16, roomTemp - 1))} className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600">
                      −
                    </button>
                    <button onClick={() => setRoomTemp(Math.min(28, roomTemp + 1))} className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600">
                      +
                    </button>
                  </div>
                </div>

                {/* Lighting Control */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-amber-700 font-semibold uppercase">Brightness</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{brightness}%</p>
                    </div>
                    <Lightbulb className="w-8 h-8 text-amber-500" />
                  </div>
                  <input type="range" min="0" max="100" value={brightness} onChange={e => setBrightness(Number(e.target.value))} className="w-full mb-4" />
                  <div className="grid grid-cols-4 gap-2">
                    {["Sleep", "Relax", "Work", "Movie"].map(scene => (
                      <button
                        key={scene}
                        onClick={() => setLightingScene(scene)}
                        className={cn("px-2 py-2 rounded-lg text-xs font-medium transition-colors", lightingScene === scene ? "bg-amber-500 text-white" : "bg-white border border-amber-200 text-gray-700 hover:bg-amber-50")}
                      >
                        {scene}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Do Not Disturb */}
                <button
                  onClick={() => setDnd(!dnd)}
                  className={cn("w-full rounded-2xl p-5 flex items-center justify-between transition-all", dnd ? "bg-red-100 border border-red-200" : "bg-green-100 border border-green-200")}
                >
                  <div>
                    <p className="text-xs font-semibold uppercase mb-1" style={{ color: dnd ? "#7f1d1d" : "#15803d" }}>
                      Do Not Disturb
                    </p>
                    <p className="text-sm font-medium" style={{ color: dnd ? "#991b1b" : "#166534" }}>
                      {dnd ? "Room will not be disturbed" : "Room is available"}
                    </p>
                  </div>
                  <Bell className={cn("w-6 h-6", dnd ? "text-red-600" : "text-green-600")} />
                </button>

                {/* Door Lock */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-green-700 font-semibold uppercase">Door Status</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">Room Secured 🔒</p>
                      <p className="text-xs text-green-700 mt-1">Last locked: 2:15 PM</p>
                    </div>
                    <Lock className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                {/* Housekeeping Modal Button */}
                <button
                  onClick={() => setShowHousekeepingModal(true)}
                  className="w-full px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Request Housekeeping
                </button>
              </motion.div>
            )}

            {/* CONCIERGE AI TAB */}
            {activeTab === "concierge" && (
              <motion.div key="concierge" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col h-full p-4">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                  {chatMessages.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">Aria · Hotel AI Concierge</h3>
                      <p className="text-sm text-gray-600 mb-4">Hello {guestName}! I'm Aria, your personal concierge. I'm here 24/7 to help with anything during your stay.</p>
                    </div>
                  )}
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={cn("flex", msg.role === "guest" ? "justify-end" : "justify-start")}>
                      <div
                        className={cn("max-w-xs px-4 py-2 rounded-2xl text-sm", msg.role === "guest" ? "bg-indigo-600 text-white rounded-br-none" : "bg-gray-200 text-gray-900 rounded-bl-none")}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                    </div>
                  )}
                </div>

                {/* Quick Replies */}
                {chatMessages.length === 0 && (
                  <div className="space-y-2 mb-4">
                    {quickReplies.map(reply => (
                      <button
                        key={reply}
                        onClick={() => handleQuickReply(reply)}
                        className="w-full text-left px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}

                {/* Chat Input */}
                <div className="flex gap-2">
                  <input
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyPress={e => e.key === "Enter" && handleSendMessage()}
                    type="text"
                    placeholder="Ask me anything..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                  <button onClick={handleSendMessage} className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* BOOK/EXPLORE TAB */}
            {activeTab === "book" && (
              <motion.div key="book" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-4 space-y-4">
                {/* Search Bar */}
                <input
                  type="text"
                  placeholder="Search rooms, facilities, packages..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />

                {/* Featured Packages */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Featured Packages</h3>
                  <div className="space-y-3">
                    {[
                      { name: "Honeymoon Package", price: 250, color: "from-pink-400 to-rose-500" },
                      { name: "Breakfast Included", price: 120, color: "from-amber-400 to-orange-500" },
                      { name: "Spa & Stay", price: 185, color: "from-violet-400 to-purple-500" }
                    ].map((pkg, i) => (
                      <div key={i} className={cn("bg-gradient-to-r p-4 rounded-xl text-white flex items-center justify-between", `${pkg.color}`)}>
                        <div>
                          <p className="font-semibold text-sm">{pkg.name}</p>
                          <p className="text-xs text-white/80">BHD {pkg.price}/night</p>
                        </div>
                        <button className="px-3 py-1 bg-white text-sm font-medium text-gray-900 rounded-lg hover:bg-gray-100">
                          Book Now
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Room Types */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Available Room Types</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: "Deluxe", amenities: "2 guests • Bath & Shower", price: 85 },
                      { name: "Suite", amenities: "4 guests • Living Area", price: 150 },
                      { name: "Presidential", amenities: "6 guests • 2 Bedrooms", price: 250 },
                      { name: "Studio", amenities: "1-2 guests • Kitchenette", price: 65 }
                    ].map((room, i) => (
                      <div key={i} className="bg-white border border-gray-200 rounded-xl p-3">
                        <p className="font-semibold text-gray-900 text-sm mb-1">{room.name}</p>
                        <p className="text-xs text-gray-600 mb-3">{room.amenities}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-indigo-600">BHD {room.price}</p>
                          <button className="px-2 py-1 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700">
                            Book
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hotel Facilities */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Hotel Facilities</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { name: "Pool", icon: Droplets },
                      { name: "Spa", icon: Waves },
                      { name: "Gym", icon: Dumbbell },
                      { name: "Restaurant", icon: UtensilsCrossed },
                      { name: "Business Centre", icon: BarChart3 },
                      { name: "Valet Parking", icon: MapPin }
                    ].map((facility, i) => (
                      <div key={i} className="bg-white border border-gray-200 rounded-xl p-3 text-center">
                        <facility.icon className="w-6 h-6 mx-auto mb-2 text-indigo-600" />
                        <p className="text-xs font-medium text-gray-900">{facility.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        <div className="border-t border-gray-200 bg-white px-2 py-3 flex gap-1">
          {[
            { id: "stay", label: "Stay", icon: Home },
            { id: "room", label: "Room", icon: Lightbulb },
            { id: "concierge", label: "Concierge", icon: Sparkles },
            { id: "book", label: "Book", icon: ShoppingBag }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-colors",
                activeTab === tab.id ? "bg-indigo-100 text-indigo-600" : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Housekeeping Modal */}
        <AnimatePresence>
          {showHousekeepingModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl shadow-lg p-6 max-w-sm w-full mx-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">What do you need?</h3>
                  <button onClick={() => setShowHousekeepingModal(false)} className="text-gray-500 hover:text-gray-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                  {["Fresh Towels", "Make Up Room", "Extra Pillows", "Extra Blanket", "Toiletries Refill"].map(item => (
                    <label key={item} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        checked={housekeepingItems.includes(item)}
                        onChange={e => setHousekeepingItems(e.target.checked ? [...housekeepingItems, item] : housekeepingItems.filter(i => i !== item))}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={housekeepingNotes}
                    onChange={e => setHousekeepingNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none h-16"
                    placeholder="Any additional requests..."
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowHousekeepingModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50">
                    Cancel
                  </button>
                  <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">
                    Submit Request
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}