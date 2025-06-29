// منطق المحادثة الطبية
const SYMPTOMS_MAPPING = {
  "ألم في الصدر": "قلب",
  صداع: "مخ وأعصاب",
  حكة: "جلدية",
  "ألم في الأذن": "أنف وأذن",
  "ألم في البطن": "باطنة عامة",
  "تأخر الدورة": "نساء وتوليد",
  "حمى عند الطفل": "أطفال",
}

const DOCTORS_DATA = [
  {
    name: "د. أحمد",
    specialty: "قلب",
    address: "القاهرة",
    consultationPrice: 100,
    callPrice: 50,
    schedule: "10:00 صباحاً - 2:00 مساءً",
    phone: "123456789",
    url: "https://example.com/doctor1",
  },
  {
    name: "د. محمد",
    specialty: "مخ وأعصاب",
    address: "الإسكندرية",
    consultationPrice: 150,
    callPrice: 75,
    schedule: "10:00 صباحاً - 6:00 مساءً",
    phone: "987654321",
    url: "https://example.com/doctor2",
  },
  // Add more doctors as needed
]

class MedicalChatbot {
  constructor() {
    this.currentStep = "symptoms"
    this.selectedSpecialty = ""
    this.availableDoctors = []
    this.selectedDoctor = null
    this.availableAppointments = []
    this.selectedAppointment = ""
  }

  processMessage(userInput) {
    const userInputLower = userInput.toLowerCase().trim()

    if (this.currentStep === "symptoms") {
      return this.handleSymptoms(userInputLower)
    } else if (this.currentStep === "doctor_selection") {
      return this.handleDoctorSelection(userInput)
    } else if (this.currentStep === "appointment_selection") {
      return this.handleAppointmentSelection(userInput)
    } else if (this.currentStep === "booking_confirmation") {
      return this.handleBookingConfirmation(userInput)
    }

    return "عذراً، حدث خطأ. يرجى المحاولة مرة أخرى."
  }

  handleSymptoms(userInput) {
    let detectedSpecialty = ""

    // البحث عن التخصص المناسب
    for (const [symptom, specialty] of Object.entries(SYMPTOMS_MAPPING)) {
      if (userInput.includes(symptom.toLowerCase())) {
        detectedSpecialty = specialty
        break
      }
    }

    if (!detectedSpecialty) {
      return `لم أتمكن من تحديد التخصص المناسب للعرض "${userInput}".

يرجى وصف الأعراض بوضوح أكثر أو اختيار من الأمثلة التالية:

**أمراض القلب:** ألم في الصدر، خفقان، ضيق تنفس
**مخ وأعصاب:** صداع، دوخة، تنميل
**جلدية:** حكة، طفح جلدي، حبوب
**أنف وأذن:** ألم في الأذن، التهاب الحلق، زكام
**باطنة عامة:** ألم في البطن، حمى، غثيان
**نساء وتوليد:** تأخر الدورة، إفرازات، ألم في الحوض
**أطفال:** حمى عند الطفل، سعال، مغص`
    }

    const doctors = DOCTORS_DATA.filter((doctor) => doctor.specialty === detectedSpecialty)

    if (doctors.length === 0) {
      return `لا يوجد أطباء متاحون في تخصص ${detectedSpecialty}.`
    }

    this.selectedSpecialty = detectedSpecialty
    this.availableDoctors = doctors
    this.currentStep = "doctor_selection"

    let response = `تم تحديد التخصص: **${detectedSpecialty}** ✅

الأطباء المتاحون:

`

    doctors.forEach((doctor, index) => {
      const callInfo = doctor.callPrice ? `📞 ${doctor.callPrice} جنيه` : "📞 غير متاحة"
      response += `**${index + 1}.** ${doctor.name}
`
      response += `   📍 ${doctor.address}
`
      response += `   💰 كشف: ${doctor.consultationPrice} جنيه | ${callInfo}
`
      response += `   ⏰ ${doctor.schedule}

`
    })

    response += `اختر رقم الطبيب (1-${doctors.length}):`
    return response
  }

  handleDoctorSelection(userInput) {
    const doctorIndex = Number.parseInt(userInput.trim()) - 1

    if (isNaN(doctorIndex) || doctorIndex < 0 || doctorIndex >= this.availableDoctors.length) {
      return `يرجى اختيار رقم صحيح من 1 إلى ${this.availableDoctors.length}`
    }

    const doctor = this.availableDoctors[doctorIndex]
    this.selectedDoctor = doctor
    this.currentStep = "appointment_selection"

    const appointments = this.generateAppointments()
    this.availableAppointments = appointments

    let response = `تم اختيار: **${doctor.name}** ✅

`
    response += `📋 **معلومات الطبيب:**
`
    response += `🏥 التخصص: ${doctor.specialty}
`
    response += `📍 العنوان: ${doctor.address}
`
    response += `💰 سعر الكشف: ${doctor.consultationPrice} جنيه
`
    response += `📞 سعر المكالمة: ${doctor.callPrice ? doctor.callPrice + " جنيه" : "غير متاحة"}

`
    response += `**المواعيد المتاحة:**

`

    appointments.forEach((appointment, index) => {
      response += `**${index + 1}.** ${appointment}
`
    })

    response += `
اختر رقم الموعد (1-${appointments.length}):`
    return response
  }

  handleAppointmentSelection(userInput) {
    const appointmentIndex = Number.parseInt(userInput.trim()) - 1

    if (isNaN(appointmentIndex) || appointmentIndex < 0 || appointmentIndex >= this.availableAppointments.length) {
      return `يرجى اختيار رقم صحيح من 1 إلى ${this.availableAppointments.length}`
    }

    const appointment = this.availableAppointments[appointmentIndex]
    this.selectedAppointment = appointment
    this.currentStep = "booking_confirmation"

    const response =
      `📋 **ملخص الحجز:**

` +
      `👨‍⚕️ **الطبيب:** ${this.selectedDoctor?.name}
` +
      `🏥 **التخصص:** ${this.selectedDoctor?.specialty}
` +
      `📅 **الموعد:** ${appointment}
` +
      `📍 **العنوان:** ${this.selectedDoctor?.address}
` +
      `💰 **السعر:** ${this.selectedDoctor?.consultationPrice} جنيه
` +
      `📞 **الهاتف:** ${this.selectedDoctor?.phone}

` +
      `هل تريد تأكيد الحجز؟ (نعم/لا)`

    return response
  }

  handleBookingConfirmation(userInput) {
    const userInputLower = userInput.trim().toLowerCase()

    if (["نعم", "yes", "موافق", "تأكيد", "احجز"].includes(userInputLower)) {
      const bookingId = `BK${Math.floor(Math.random() * 90000) + 10000}`

      const response =
        `✅ **تم تأكيد الحجز بنجاح!**

` +
        `🎫 **رقم الحجز:** ${bookingId}
` +
        `👨‍⚕️ **الطبيب:** ${this.selectedDoctor?.name}
` +
        `📅 **الموعد:** ${this.selectedAppointment}
` +
        `📍 **العنوان:** ${this.selectedDoctor?.address}
` +
        `💰 **المبلغ:** ${this.selectedDoctor?.consultationPrice} جنيه
` +
        `📞 **للاستفسار:** ${this.selectedDoctor?.phone}

` +
        `🔗 **رابط الطبيب:** ${this.selectedDoctor?.url}

` +
        `شكراً لاستخدام خدمتنا! 🙏

` +
        `💡 **نصيحة:** احتفظ برقم الحجز للمراجعة

هل تحتاج لحجز موعد آخر؟ أخبرني عن الأعراض الجديدة.`

      // Reset for new conversation
      this.reset()
      return response
    } else if (["لا", "no", "إلغاء", "الغاء"].includes(userInputLower)) {
      this.reset()
      return `تم إلغاء الحجز. 🚫

هل تريد البحث عن طبيب آخر؟ أخبرني عن الأعراض.`
    } else {
      return "يرجى الإجابة بـ 'نعم' أو 'لا'"
    }
  }

  generateAppointments() {
    const appointments = []
    const today = new Date()
    const days = ["الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"]
    const timeSlots = ["10:00 صباحاً", "2:00 مساءً", "6:00 مساءً"]

    for (let i = 1; i <= 4; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dayName = days[date.getDay()]
      const timeSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)]
      const appointment = `${dayName} ${date.toLocaleDateString("ar-EG")} - ${timeSlot}`
      appointments.push(appointment)
    }

    return appointments
  }

  reset() {
    this.currentStep = "symptoms"
    this.selectedSpecialty = ""
    this.availableDoctors = []
    this.selectedDoctor = null
    this.availableAppointments = []
    this.selectedAppointment = ""
  }
}
