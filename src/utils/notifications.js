// 🔔 Play notification sound when order is saved
export const playNotificationSound = () => {
  try {
    // Try Web Audio API first
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Play a beep sound - two beeps for better notification
    const now = audioContext.currentTime
    
    // First beep
    oscillator.frequency.value = 900
    oscillator.type = "sine"
    gainNode.gain.setValueAtTime(0.3, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2)
    oscillator.start(now)
    oscillator.stop(now + 0.2)

    // Second beep with slight delay
    const osc2 = audioContext.createOscillator()
    const gain2 = audioContext.createGain()
    osc2.connect(gain2)
    gain2.connect(audioContext.destination)
    
    osc2.frequency.value = 1100
    osc2.type = "sine"
    gain2.gain.setValueAtTime(0.3, now + 0.3)
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.5)
    osc2.start(now + 0.3)
    osc2.stop(now + 0.5)

    console.log("✅ Notification sound played")
  } catch (error) {
    console.error("Audio playback error:", error)
  }
}

// 🔔 Show browser notification
export const showBrowserNotification = (orderNumber) => {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("✅ Order Saved Successfully!", {
      body: `Order #${orderNumber} has been placed and saved`,
      icon: "📋",
      badge: "🛒",
      tag: "order-notification",
      requireInteraction: false
    })
    console.log("✅ Browser notification shown")
  } else {
    console.log("⚠️ Notification permission not granted")
  }
}

// 🔔 Request notification permission
export const requestNotificationPermission = () => {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission()
  }
}

// 🔔 Trigger notification and sound
export const triggerOrderNotification = (orderNumber) => {
  playNotificationSound()
  showBrowserNotification(orderNumber)
}
