import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaRobot, 
  FaPaperPlane, 
  FaTrash, 
  FaVolumeUp, 
  FaVolumeMute, 
  FaCalendarAlt, 
  FaCut, 
  FaUserTie, 
  FaMapMarkerAlt, 
  FaClock 
} from 'react-icons/fa';
import barberData from '../data/barber.json';
import barberProfile from '../data/barberProfile.json';
import hairStyles from '../data/hairStyles.json';

const AiChatPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Salom! Men Web Barber dasturining AI yordamchisiman. Sizga qanday yordam bera olaman? Xizmatlarimiz, soch stillari yoki bo'sh vaqtlarimiz haqida so'rashingiz mumkin.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const messagesEndRef = useRef(null);

  const quickSuggestions = [
    { text: "💇‍♂️ Xizmatlar va narxlar", type: "services" },
    { text: "🧔 Sartarosh haqida", type: "barber" },
    { text: "📅 Qanday yozilish mumkin?", type: "booking" },
    { text: "🎨 Soch stillari", type: "styles" },
    { text: "📍 Manzil va ish vaqti", type: "location" }
  ];

  // Sound generator using Web Audio API
  const playSound = (type) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === 'sent') {
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'received') {
        osc.frequency.setValueAtTime(450, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(550, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
        
        setTimeout(() => {
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.frequency.setValueAtTime(650, ctx.currentTime);
          gain2.gain.setValueAtTime(0.04, ctx.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
          osc2.start();
          osc2.stop(ctx.currentTime + 0.12);
        }, 80);
      }
    } catch (e) {
      console.log('Audio error:', e);
    }
  };

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Keyword response matching logic
  const getBotResponse = (text) => {
    const cleanText = text.toLowerCase().trim();
    
    // Services / Prices query
    if (
      cleanText.includes('xizmat') || 
      cleanText.includes('narx') || 
      cleanText.includes('qancha') || 
      cleanText.includes('nimalar bor') || 
      cleanText.includes('prays') ||
      cleanText.includes('pul')
    ) {
      return {
        text: "Biz quyidagi professional xizmatlarni taklif qilamiz. Sizga qulay bo'lishi uchun xizmat kartalarini taqdim etaman, ularni bosib to'g'ridan-to'g'ri buyurtma sahifasiga o'tishingiz mumkin:",
        type: 'services',
        data: barberData.services
      };
    }

    // Barber info query
    if (
      cleanText.includes('sartarosh') || 
      cleanText.includes('javohir') || 
      cleanText.includes('aliyev') || 
      cleanText.includes('ustoz') || 
      cleanText.includes('kim') ||
      cleanText.includes('bio') ||
      cleanText.includes('tajriba')
    ) {
      return {
        text: `Bizning bosh sartaroshimiz — **Javohir Aliyev**. U 15 yillik professional tajribaga ega bo'lib, Londondagi xalqaro kurslarni tamomlagan va O'zbekiston chempioni (2020) hisoblanadi. Mana u haqida qisqacha ma'lumot:`,
        type: 'barber',
        data: barberProfile
      };
    }

    // Styles query
    if (
      cleanText.includes('stil') || 
      cleanText.includes('soch turi') || 
      cleanText.includes('turmak') || 
      cleanText.includes('pompadour') || 
      cleanText.includes('undercut') || 
      cleanText.includes('crop') || 
      cleanText.includes('fade') || 
      cleanText.includes('soch')
    ) {
      return {
        text: "Bizning salonda soch turiga qarab eng zamonaviy stillar tanlanadi. Quyida biz eng ko'p tavsiya etadigan uslublar keltirilgan. Batafsil ma'lumotni 'Stillar' sahifasida ham ko'rishingiz mumkin:",
        type: 'styles',
        data: hairStyles
      };
    }

    // Booking instructions
    if (
      cleanText.includes('navbat') || 
      cleanText.includes('yozilish') || 
      cleanText.includes('bron') || 
      cleanText.includes('buyurtma') || 
      cleanText.includes('zakaz') || 
      cleanText.includes('vaqt tanlash')
    ) {
      return {
        text: "Sartaroshimizga navbatga yozilish juda oson! Buning uchun chap menyudagi yoki pastdagi **'Buyurtma qilish'** tugmasini bosing, xizmatni, o'zingizga qulay sana va soatni tanlab to'lov qiling. Har qanday savolda yordam berishga tayyorman!",
        type: 'booking_link'
      };
    }

    // Address & Working hours query
    if (
      cleanText.includes('manzil') || 
      cleanText.includes('lokatsiya') || 
      cleanText.includes('joy') || 
      cleanText.includes('qayerda') || 
      cleanText.includes('adres') ||
      cleanText.includes('ish vaqt') || 
      cleanText.includes('ish kuni') || 
      cleanText.includes('soat') || 
      cleanText.includes('hafta') || 
      cleanText.includes('vaqt')
    ) {
      return {
        text: "📍 **Bizning manzilimiz**: Toshkent shahri, Chilonzor tumani (metro bekatlariga yaqin)\n\n🕒 **Ish vaqti**:\n- Dushanba - Shanba: 09:00 - 18:30\n- Yakshanba: Dam olish kuni\n\nMijozlarimizga qulaylik yaratish maqsadida faqat oldindan navbatga yozilgan holda qabul qilamiz.",
        type: 'location_info'
      };
    }

    // Greetings
    if (
      cleanText.includes('salom') || 
      cleanText.includes('assalom') || 
      cleanText.includes('qale') || 
      cleanText.includes('yaxshimi') || 
      cleanText.includes('hello') || 
      cleanText.includes('hi')
    ) {
      return {
        text: "Assalomu alaykum! Web Barber AI yordamchisiga xush kelibsiz! Sizga qanday ko'mak bera olaman? Masalan, xizmatlar narxi, ish vaqtimiz yoki sartaroshimiz haqida so'rashingiz mumkin.",
        type: 'greeting'
      };
    }

    // Thanks
    if (
      cleanText.includes('rahmat') || 
      cleanText.includes('tashakkur') || 
      cleanText.includes('sog bo') || 
      cleanText.includes('sog\' bo') || 
      cleanText.includes('tushunarli') || 
      cleanText.includes('ok')
    ) {
      return {
        text: "Arziydi! Har doim sizga yordam berishdan xursandman. Sochingizga ideal ko'rinish berish uchun salonimizga kutib qolamiz! ✂️💈",
        type: 'thanks'
      };
    }

    // Default reply
    return {
      text: "Kechirasiz, ushbu savolni tushunmadim. Men Web Barber saloni haqidagi ma'lumotlarga moslashtirilganman. Iltimos, pastdagi tezkor tugmalardan foydalanib ko'ring yoki quyidagilardan biri haqida so'rang:\n\n- Xizmatlar va ularning narxi\n- Sartarosh Javohir Aliyev\n- Zamonaviy soch stillari\n- Ish vaqti va lokatsiya",
      type: 'unknown'
    };
  };

  const handleSendMessage = (textToSend) => {
    const messageText = textToSend || inputText;
    if (!messageText.trim()) return;

    // Add user message
    const newUserMessage = {
      id: Date.now(),
      sender: 'user',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputText('');
    playSound('sent');
    setIsTyping(true);

    // Simulate AI typing delay
    setTimeout(() => {
      const response = getBotResponse(messageText);
      const newBotMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: response.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        attachmentType: response.type,
        attachmentData: response.data
      };
      
      setMessages(prev => [...prev, newBotMessage]);
      setIsTyping(false);
      playSound('received');
    }, 1000 + Math.random() * 800); // 1-1.8 seconds delay
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const clearChat = () => {
    if (window.confirm("Chat tarixini tozalashni xohlaysizmi?")) {
      setMessages([
        {
          id: Date.now(),
          sender: 'bot',
          text: "Chat tozalandi. Sizga qanday yordam bera olaman?",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  return (
    <div className="w-full lg:w-5/6 ml-auto min-h-[calc(100vh-80px)] flex flex-col pb-24 lg:pb-6 pt-4 px-2 sm:px-4 animate-fadeIn">
      {/* Chat Container */}
      <div className="flex-1 max-w-4xl w-full mx-auto bg-zinc-900/60 backdrop-blur-xl border border-emerald-500/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-4 py-3 bg-zinc-950/80 border-b border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-400/50 flex items-center justify-center text-emerald-400">
                <FaRobot size={22} className="animate-button-float" />
              </div>
              <span className="absolute bottom-0 right-0 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <h3 className="text-white font-bold text-sm sm:text-base leading-tight">Sartarosh AI</h3>
              <p className="text-emerald-400 text-xs font-semibold">Online • Maslahatchi</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Sound Toggle */}
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                soundEnabled 
                  ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10' 
                  : 'border-zinc-700 text-zinc-500 bg-zinc-800/20 hover:bg-zinc-800/40'
              }`}
              title={soundEnabled ? "Ovozni o'chirish" : "Ovozni yoqish"}
            >
              {soundEnabled ? <FaVolumeUp size={16} /> : <FaVolumeMute size={16} />}
            </button>

            {/* Clear Button */}
            <button 
              onClick={clearChat}
              className="p-2 rounded-lg border border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10 transition-all cursor-pointer"
              title="Tarixni tozalash"
            >
              <FaTrash size={16} />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[350px] max-h-[60vh] scrollbar-thin scrollbar-thumb-zinc-700">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-fadeIn`}
            >
              <div className="flex items-end gap-2 max-w-[85%]">
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-zinc-950 flex items-center justify-center text-emerald-400 shrink-0 border border-emerald-500/20">
                    <FaRobot size={15} />
                  </div>
                )}
                
                <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-md ${
                  msg.sender === 'user' 
                    ? 'bg-linear-to-br from-emerald-500 to-emerald-600 text-white rounded-br-none border border-emerald-400/30' 
                    : 'bg-zinc-950/80 text-zinc-200 rounded-bl-none border border-white/5'
                }`}>
                  {/* Message Text with simple formatting support (linebreaks and bold markdown) */}
                  <div className="whitespace-pre-line">
                    {msg.text.split('**').map((part, index) => 
                      index % 2 === 1 ? <strong key={index} className="text-emerald-400 font-extrabold">{part}</strong> : part
                    )}
                  </div>

                  {/* Rich Attachment Rendering */}
                  {msg.attachmentType === 'services' && msg.attachmentData && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fadeIn">
                      {msg.attachmentData.map((service) => (
                        <div key={service.id} className="bg-zinc-900 border border-white/10 rounded-xl p-3 flex flex-col justify-between hover:border-emerald-500/50 transition-all shadow-sm">
                          <div>
                            <h4 className="text-white font-bold text-xs sm:text-sm">{service.name}</h4>
                            <p className="text-zinc-400 text-xs mt-1">Davomiyligi: {service.duration} min</p>
                            <p className="text-emerald-400 font-bold text-xs sm:text-sm mt-2">{service.price.toLocaleString()} UZS</p>
                          </div>
                          <button 
                            onClick={() => navigate('/')} 
                            className="mt-3 w-full bg-emerald-500 hover:bg-emerald-600 active:scale-[0.97] text-white font-bold text-xs py-1.5 px-3 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer"
                          >
                            <FaCalendarAlt size={11} />
                            <span>Buyurtma</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {msg.attachmentType === 'barber' && msg.attachmentData && (
                    <div className="mt-4 bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row gap-3.5 items-center animate-fadeIn">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 text-2xl font-bold font-mono">
                        JA
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h4 className="text-white font-bold text-sm sm:text-base">{msg.attachmentData.name}</h4>
                        <p className="text-emerald-400 text-xs font-semibold">{msg.attachmentData.title}</p>
                        <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed">{msg.attachmentData.bio}</p>
                        <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
                          <span className="bg-zinc-800 border border-white/5 text-zinc-300 text-[10px] py-0.5 px-2 rounded-full flex items-center gap-1">
                            🏆 O'zbekiston Chempioni
                          </span>
                          <span className="bg-zinc-800 border border-white/5 text-zinc-300 text-[10px] py-0.5 px-2 rounded-full flex items-center gap-1">
                            🎓 Xalqaro Sertifikat
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {msg.attachmentType === 'styles' && msg.attachmentData && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fadeIn">
                      {msg.attachmentData.map((style) => (
                        <div key={style.id} className="bg-zinc-900 border border-white/10 rounded-xl p-3 flex flex-col justify-between hover:border-emerald-500/50 transition-all shadow-sm">
                          <div>
                            <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold tracking-wider uppercase py-0.5 px-1.5 rounded w-max mb-1.5">
                              {style.category}
                            </div>
                            <h4 className="text-white font-bold text-xs sm:text-sm">{style.title}</h4>
                            <p className="text-zinc-400 text-[11px] mt-1.5 leading-relaxed">{style.description}</p>
                          </div>
                          <button 
                            onClick={() => navigate('/stillar')} 
                            className="mt-3.5 w-full bg-zinc-800 hover:bg-zinc-700 active:scale-[0.97] text-white font-bold text-xs py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all border border-white/5 cursor-pointer"
                          >
                            <FaCut size={11} className="text-emerald-400" />
                            <span>Stillarni ko'rish</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {msg.attachmentType === 'booking_link' && (
                    <div className="mt-3 animate-fadeIn">
                      <button 
                        onClick={() => navigate('/')}
                        className="bg-emerald-500 hover:bg-emerald-600 active:scale-[0.97] text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer"
                      >
                        <FaCalendarAlt size={12} />
                        <span>Hozirroq navbat olish</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <span className="text-[10px] text-zinc-500 mt-1 px-1">{msg.time}</span>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-end gap-2 animate-fadeIn">
              <div className="w-8 h-8 rounded-full bg-zinc-950 flex items-center justify-center text-emerald-400 shrink-0 border border-emerald-500/20">
                <FaRobot size={15} />
              </div>
              <div className="bg-zinc-950/80 border border-white/5 p-4 rounded-2xl rounded-bl-none text-zinc-400 text-xs flex items-center gap-1.5 shadow-md">
                <span className="text-emerald-400 font-semibold">AI yozmoqda</span>
                <span className="flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="px-4 py-2 bg-zinc-950/30 border-t border-white/5 flex gap-2 overflow-x-auto scrollbar-none whitespace-nowrap">
          {quickSuggestions.map((suggest, index) => (
            <button
              key={index}
              onClick={() => handleSendMessage(suggest.text.replace(/^[^\s]+\s/, ''))}
              className="bg-zinc-900 hover:bg-emerald-500/10 hover:border-emerald-500/40 text-zinc-300 hover:text-emerald-400 border border-white/10 text-xs font-semibold py-1.5 px-3 rounded-full transition-all shrink-0 cursor-pointer active:scale-[0.95]"
            >
              {suggest.text}
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <div className="p-3 bg-zinc-950/80 border-t border-emerald-500/20 flex gap-2 items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="AI Maslahatchiga savol yo'llang..."
            className="flex-1 bg-zinc-900 text-white placeholder-zinc-500 text-sm py-3 px-4 rounded-xl border border-white/10 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
            disabled={isTyping}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isTyping}
            className={`p-3 rounded-xl font-bold flex items-center justify-center transition-all cursor-pointer ${
              inputText.trim() && !isTyping
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 active:scale-[0.95]'
                : 'bg-zinc-800 text-zinc-500 border border-white/5 cursor-not-allowed'
            }`}
          >
            <FaPaperPlane size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default AiChatPage;
