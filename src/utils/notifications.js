// 🔔 Play notification sound when order is saved
export const playNotificationSound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Play a beep sound
    oscillator.frequency.value = 800
    oscillator.type = "sine"
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  } catch (error) {
    console.error("Audio playback error:", error)
  }
}

// 🔔 Show browser notification
export const showBrowserNotification = (orderNumber) => {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Order Saved!", {
      body: `Order #${orderNumber} has been saved successfully`,
      icon: "📋",
      badge: "🛒"
    })
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
