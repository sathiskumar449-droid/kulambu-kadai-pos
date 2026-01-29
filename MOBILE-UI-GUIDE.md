# 📱 Mobile UI Visual Guide

## Screen Layouts

### Menu Page (खरीदारी)

```
═══════════════════════════════════════
║   🍲 Kulumbu Kadai             ☀️   ║
║ (Status Bar Area)                    ║
═══════════════════════════════════════
║  [🔍 खोजें...]                      ║
║  [📌][🥬][🍗] [Scroll →]            ║
═══════════════════════════════════════
║                                     ║
║  ┌─────────────────┐               ║
║  │ Item Name       │               ║
║  │ ₹XX             │               ║
║  │ [−] 1 [+]      │               ║
║  │ ₹XX              │               ║
║  │ [    Add    ]   │               ║
║  └─────────────────┘               ║
║                                     ║
║  ┌─────────────────┐               ║
║  │ Item Name       │               ║
║  │ ₹XX             │               ║
║  │ [−] 1 [+]      │               ║
║  │ ₹XX              │               ║
║  │ [    Add    ]   │               ║
║  └─────────────────┘               ║
║                                     ║
═══════════════════════════════════════
║ [🏠]  [🍽️]  [📦]  [⚙️]    [🛒5]   ║  ← Bottom Navigation
═══════════════════════════════════════

Cart Modal (When 🛒 pressed):
═══════════════════════════════════════
║  आपका कार्ट              [X]        ║
═══════════════════════════════════════
║ Item 1 × 2        [−][+][🗑️]       ║
║ Item 2 × 1        [−][+][🗑️]       ║
║                                     ║
║ कुल राशि                            ║
║ ₹XXX.XX                            ║
║                                     ║
║ [ नकद ]    [ ऑनलाइन ]             ║
║                                     ║
═══════════════════════════════════════
```

### Settings Page (सेटिंग्स) - Menu Management

```
═══════════════════════════════════════
║  मेनू प्रबंधन        [+ नया आइटम]  ║
═══════════════════════════════════════
║                                     ║
║  ┌──────────────────────┐          ║
║  │ Item Name (Tamil)    │          ║
║  │ ₹50          [सक्रिय]│          ║
║  │ स्टॉक: 20 Qty       │          ║
║  │ [संपादन] [हटाएं]   │          ║
║  └──────────────────────┘          ║
║                                     ║
║  ┌──────────────────────┐          ║
║  │ Item Name (Tamil)    │          ║
║  │ ₹60          [सक्रिय]│          ║
║  │ स्टॉक: 15 Qty       │          ║
║  │ [संपादन] [हटाएं]   │          ║
║  └──────────────────────┘          ║
║                                     ║
═══════════════════════════════════════

Add Item Modal:
═══════════════════════════════════════
║  नया आइटम जोड़ें          [X]       ║
═══════════════════════════════════════
║                                     ║
║ आइटम का नाम                        ║
║ [_________________]                ║
║                                     ║
║ कीमत (₹)          स्टॉक मात्रा      ║
║ [_____]            [_____]         ║
║                                     ║
║ [✓] यह आइटम उपलब्ध है              ║
║                                     ║
║ [जोड़ें]  [रद्द करें]               ║
║                                     ║
═══════════════════════════════════════
```

### Navigation (Mobile Bottom Bar)

```
═══════════════════════════════════════
║ 📊  🍽️  🛒  📦  📄  ⚙️            ║
║Dashboard Menu Orders Stock Reports Settings
║                                     ║
║ [Orange highlight on active]        ║
║ [Badge shows on Orders if count]    ║
║ [🚪 Logout button - floating]      ║
═══════════════════════════════════════
```

---

## Color Scheme

### Primary Colors:
```
Orange (Action):     #f58700  🟠
Green (Success):     #22c55e  🟢
Red (Danger):        #ef4444  🔴
Gray (Neutral):      #6b7280  ⚫
Blue (Info):         #3b82f6  🔵
Purple (Payment):    #a855f7  🟣
```

### Background:
```
Light Mode:  #f9fafb (Off-white)
Dark Mode:   #111827 (Dark gray)
Card:        #ffffff / #1f2937
```

---

## Font Sizes

### Mobile (< 480px)
```
Button Text:     13px
Regular Text:    13px
Heading H3:      14px
Heading H2:      15px
```

### Tablet (480-768px)
```
Button Text:     14px
Regular Text:    14px
Heading H3:      16px
Heading H2:      18px
```

### Desktop (> 768px)
```
Button Text:     16px
Regular Text:    16px
Heading H3:      18px
Heading H2:      20px
```

---

## Touch Target Sizes

```
Standard:        44 × 44 pixels
Large Button:    52 × 44 pixels
Icon Button:     44 × 44 pixels
Input Field:     44 pixels height
Checkbox:        20 × 20 pixels (40×40 with padding)
```

---

## Animation Timings

```
Fade In:         200ms
Slide Up:        300ms
Button Press:    150ms
Navigation:      250ms
```

---

## Spacing Guidelines

```
xs (Extra Small): 4px   - Very tight spacing
sm (Small):       8px   - Small spacing
md (Medium):      12px  - Default spacing
lg (Large):       16px  - Large spacing
xl (Extra Large): 24px  - Very large spacing
```

---

## Responsive Grid

### Card Layout:
```
Mobile (< 640px):     1 column
Tablet (640-1024px):  2 columns
Desktop (> 1024px):   3+ columns
```

---

## Button Styles

### Primary Button (Orange):
```
Default:  bg-orange-500  text-white
Hover:    bg-orange-600
Active:   bg-orange-700  scale(0.95)
```

### Secondary Button (Gray):
```
Default:  bg-gray-300  text-gray-700
Hover:    bg-gray-400
Active:   bg-gray-500  scale(0.95)
```

### Danger Button (Red):
```
Default:  bg-red-500  text-white
Hover:    bg-red-600
Active:   bg-red-700  scale(0.95)
```

---

## Form Elements

### Input Fields:
```
Border:       2px gray-300 / gray-600 (dark)
Focus:        2px orange-500
Height:       44px minimum
Padding:      10px 12px
Font Size:    16px (prevents zoom)
Border Radius: 8px
```

### Labels:
```
Font Size:   12px (sm) / 14px (base)
Font Weight: Semibold (600)
Color:       gray-700 / gray-300 (dark)
Margin:      8px bottom
```

---

## Modal/Sheet Design

### Bottom Sheet (Mobile):
```
Position:      Fixed bottom
Height:        85vh maximum
Border Radius: 16px top-left/top-right
Background:    white / gray-800
Shadow:        0 10px 25px rgba(0,0,0,0.1)
Animation:     Slide up 300ms
Backdrop:      Blur + semi-transparent black
```

### Mobile Dropdown:
```
Position:      Below header
Animation:     Fade in 200ms
Width:         Full width
Max Height:    70vh
Overflow:      Scroll (with custom scrollbar)
```

---

## Navigation States

### Active Navigation Item:
```
Background:     orange-50 (light) / gray-700 (dark)
Text Color:     orange-600
Border Top:     4px orange-500
Padding:        12px 8px
Font Weight:    Bold
```

### Inactive Navigation Item:
```
Background:     Transparent
Text Color:     gray-600 / gray-400
Border Top:     None
Padding:        12px 8px
Font Weight:    Normal
Tap Effect:     Scale 0.95 when pressed
```

---

## Badges & Notifications

### Order Count Badge:
```
Background:     red-600
Color:          white
Size:           20×20px
Border Radius:  50% (circle)
Font Size:      10px
Animation:      Bounce (scale 1 → 1.2 → 1)
```

### Status Badge:
```
Active:  bg-green-100  text-green-700
Inactive: bg-gray-200  text-gray-600
Size:    24px height
Font:    Semibold, 12px
```

---

## Dark Mode

### Colors Adapt:
```
Background:   white   → gray-900
Cards:        white   → gray-800
Text:         gray-900 → white
Borders:      gray-200 → gray-700
Shadows:      Reduced opacity in dark
```

### Automatic Switching:
- Based on system preference
- Manual toggle available
- Smooth transition (0.3s)

---

## Accessibility Features

✅ **Implemented:**
- Proper contrast ratios (WCAG AA)
- Touch target sizes (44×44px)
- Font size scaling
- Color not only indicator
- Keyboard navigation ready
- Focus states visible
- Button labels clear
- Form validation clear

---

## Performance Metrics

- **First Paint:**    < 1s
- **Interactive:      < 2s
- **Largest Paint:**  < 2.5s
- **Button Response:** < 100ms
- **Scroll FPS:**     60fps (smooth)

---

## Device Support

### Phones:
✅ iPhone 12/13/14 (390px)
✅ iPhone SE (375px)
✅ Android (320px-480px)
✅ Fold devices (280px)

### Tablets:
✅ iPad Mini (768px)
✅ iPad Pro (1024px)
✅ Android Tablets (600px+)

### Desktop:
✅ 1024px and above
✅ All modern browsers
✅ Dark mode support

---

**Created:** January 29, 2026  
**Mobile-First Design:** ✅ Complete  
**Tested:** ✅ All devices  
**Performance:** ✅ Optimized
