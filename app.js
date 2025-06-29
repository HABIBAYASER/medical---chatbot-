// التطبيق الرئيسي
let chatbot
let isLoading = false
const MedicalChatbot = require("./MedicalChatbot") // Declare or import the MedicalChatbot variable
const SYMPTOM_EXAMPLES = [
  { icon: "ปวดศีรษะ", text: "ปวดศีรษะ" },
  { icon: "صداع", text: "صداع" },
  { icon: "ไอ", text: "ไอ" },
] // Declare the SYMPTOM_EXAMPLES variable

// تهيئة التطبيق
document.addEventListener("DOMContentLoaded", () => {
  chatbot = new MedicalChatbot()
  initializeApp()
})

function initializeApp() {
  // إنشاء أمثلة الأعراض
  createSymptomExamples()

  // ربط الأحداث
  bindEvents()
}

function createSymptomExamples() {
  const symptomsGrid = document.getElementById("symptomsGrid")

  SYMPTOM_EXAMPLES.forEach((symptom) => {
    const symptomCard = document.createElement("div")
    symptomCard.className = "symptom-card"
    symptomCard.innerHTML = `
            <span class="symptom-icon">${symptom.icon}</span>
            <p>${symptom.text}</p>
        `

    symptomCard.addEventListener("click", () => {
      startChat(symptom.text)
    })

    symptomsGrid.appendChild(symptomCard)
  })
}

function bindEvents() {
  // زر البدء في الصفحة الرئيسية
  document.getElementById("startChatBtn").addEventListener("click", () => {
    const input = document.getElementById("symptomInput").value.trim()
    if (input) {
      startChat(input)
    }
  })

  // Enter في حقل الإدخال الرئيسي
  document.getElementById("symptomInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const input = e.target.value.trim()
      if (input) {
        startChat(input)
      }
    }
  })

  // زر الإرسال في المحادثة
  document.getElementById("sendMessageBtn").addEventListener("click", sendMessage)

  // Enter في حقل المحادثة
  document.getElementById("chatInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  })

  // زر العودة للرئيسية
  document.getElementById("backToHomeBtn").addEventListener("click", () => {
    showHomePage()
    resetChat()
  })
}

function startChat(symptom = "") {
  showChatPage()

  // إضافة رسالة الترحيب
  addMessage(
    "مرحباً! أنا مساعدك الطبي الذكي 🩺\n\nأخبرني عن الأعراض التي تشعر بها وسأساعدك في العثور على الطبيب المناسب وحجز موعد معه.",
    true,
  )

  // إذا كان هناك عرض محدد، أرسله
  if (symptom) {
    document.getElementById("chatInput").value = symptom
    setTimeout(() => {
      sendMessage()
    }, 500)
  }
}

async function sendMessage() {
  const input = document.getElementById("chatInput")
  const message = input.value.trim()

  if (!message || isLoading) return

  // إضافة رسالة المستخدم
  addMessage(message, false)
  input.value = ""

  // إظهار مؤشر الكتابة
  showTypingIndicator()
  isLoading = true

  // محاكاة تأخير الاستجابة
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // إخفاء مؤشر الكتابة
  hideTypingIndicator()

  try {
    const response = chatbot.processMessage(message)
    addMessage(response, true)
  } catch (error) {
    addMessage("عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.", true)
  } finally {
    isLoading = false
  }
}

function addMessage(text, isBot) {
  const messagesContainer = document.getElementById("chatMessages")
  const messageDiv = document.createElement("div")
  messageDiv.className = `message ${isBot ? "bot" : "user"}`

  const time = new Date().toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  })

  messageDiv.innerHTML = `
        <div class="message-avatar">
            ${isBot ? "🤖" : "👤"}
        </div>
        <div class="message-content">
            <div>${formatMessageText(text)}</div>
            <div class="message-time">${time}</div>
        </div>
    `

  messagesContainer.appendChild(messageDiv)
  scrollToBottom()
}

function formatMessageText(text) {
  return text
    .split("\n")
    .map((line) => {
      // تنسيق النص العريض
      return line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    })
    .join("<br>")
}

function showTypingIndicator() {
  const messagesContainer = document.getElementById("chatMessages")
  const typingDiv = document.createElement("div")
  typingDiv.className = "typing-indicator"
  typingDiv.id = "typingIndicator"

  typingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `

  messagesContainer.appendChild(typingDiv)
  scrollToBottom()
}

function hideTypingIndicator() {
  const typingIndicator = document.getElementById("typingIndicator")
  if (typingIndicator) {
    typingIndicator.remove()
  }
}

function scrollToBottom() {
  const messagesContainer = document.getElementById("chatMessages")
  messagesContainer.scrollTop = messagesContainer.scrollHeight
}

function showHomePage() {
  document.getElementById("homePage").classList.add("active")
  document.getElementById("chatPage").classList.remove("active")
}

function showChatPage() {
  document.getElementById("homePage").classList.remove("active")
  document.getElementById("chatPage").classList.add("active")
}

function resetChat() {
  document.getElementById("chatMessages").innerHTML = ""
  document.getElementById("chatInput").value = ""
  document.getElementById("symptomInput").value = ""
  chatbot.reset()
  isLoading = false
}
