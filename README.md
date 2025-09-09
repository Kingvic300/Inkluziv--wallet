# INKLUZIV - Accessible Crypto Wallet

<div align="center">
  <img src="https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop" alt="Inkluziv Logo" width="120" height="120" style="border-radius: 20px;">
  
  **Revolutionary accessible crypto wallet designed with accessibility-first principles for inclusive DeFi**
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-green.svg)](https://www.w3.org/WAI/WCAG21/quickref/)
  [![Voice Commands](https://img.shields.io/badge/Voice-Enabled-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
</div>

## 🌟 Project Overview

Inkluziv is the world's first crypto wallet designed with accessibility at its core. Built for everyone, including users with visual, auditory, motor, and cognitive disabilities, Inkluziv makes DeFi truly inclusive through innovative voice commands, screen reader optimization, and universal design principles.

### Why Inkluziv?

- **Voice-First Navigation**: Control your entire wallet using natural voice commands
- **Screen Reader Optimized**: Full compatibility with NVDA, JAWS, VoiceOver, and other assistive technologies
- **High Contrast Themes**: Multiple color schemes including high-contrast mode for visual accessibility
- **Keyboard Navigation**: Complete functionality without requiring a mouse
- **Touch-Friendly**: Large touch targets (44px minimum) for users with motor impairments
- **Cognitive Accessibility**: Clear language, consistent layouts, and reduced cognitive load

## ✨ Features

### Core Wallet Features
- 🔐 **Secure Authentication** - Email/password and voice biometric login
- 💰 **Multi-Token Support** - ETH, USDC, BTC, MATIC, and more
- 📊 **Portfolio Overview** - Real-time balance tracking and analytics
- 💸 **Send & Receive** - Easy token transfers with QR code support
- 🔄 **Token Swapping** - Built-in DEX integration with live rates
- 🏦 **Fiat On/Off Ramp** - Buy/sell crypto with Nigerian Naira (NGN)
- 🎯 **Staking Rewards** - Earn yield on your crypto holdings
- 📈 **Transaction History** - Complete audit trail with export functionality

### Accessibility Features
- 🎤 **Voice Commands** - Navigate and control the app hands-free
- 👁️ **Screen Reader Support** - ARIA labels and semantic HTML
- 🎨 **Customizable Themes** - Dark, light, and high-contrast modes
- 📱 **Responsive Design** - Works on all devices and screen sizes
- ⌨️ **Keyboard Navigation** - Full functionality via keyboard shortcuts
- 🔊 **Audio Feedback** - Voice announcements for important actions
- 📏 **Scalable Text** - Adjustable font sizes from 14px to 22px
- 🎯 **Large Touch Targets** - Minimum 44px for easy interaction

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling with custom accessibility tokens
- **Framer Motion** - Smooth animations with reduced motion support
- **React Router** - Client-side routing
- **Radix UI** - Accessible component primitives

### Accessibility & Voice
- **Web Speech API** - Native browser voice recognition
- **ARIA Standards** - WCAG 2.1 AA compliance
- **Screen Reader Testing** - Tested with NVDA, JAWS, and VoiceOver

### Development Tools
- **Vite** - Fast build tool and dev server
- **ESLint** - Code linting with accessibility rules
- **Prettier** - Code formatting
- **Lovable Tagger** - Component development tools

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Modern browser with Web Speech API support

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/inkluziv.git
   cd inkluziv
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080`

### Build for Production
```bash
npm run build
npm run preview
```

## 📖 Usage Instructions

### Getting Started

1. **Create Account**: Sign up with email or use voice biometric registration
2. **Secure Login**: Access your wallet via traditional login or voice authentication
3. **Explore Dashboard**: View your portfolio, recent transactions, and quick actions
4. **Voice Commands**: Click the microphone button and say commands like "check balance"

### Basic Operations

#### Sending Tokens
1. Navigate to Wallet → Send
2. Enter recipient address and amount
3. Select token type
4. Confirm transaction
5. **Voice Alternative**: Say "send tokens" and follow voice prompts

#### Receiving Payments
1. Go to Wallet → Receive
2. Share your wallet address or QR code
3. **Voice Alternative**: Say "receive payment" to display your address

#### Token Swapping
1. Visit the Swap page
2. Select tokens to exchange
3. Enter amount and review rates
4. Execute swap
5. **Voice Alternative**: Say "swap tokens" to open swap interface

#### Fiat Trading
1. Access the Fiat page
2. Choose buy or sell
3. Enter amount in NGN
4. Select payment method
5. **Voice Alternative**: Say "buy crypto" or "sell crypto"

## 🎤 Voice Command Guide

### How Voice Commands Work

Inkluziv uses the browser's native Web Speech API to process voice commands. The system:

1. **Listens** for your voice input when activated
2. **Processes** speech using browser's speech recognition
3. **Matches** your words to predefined commands
4. **Executes** the corresponding action
5. **Provides** audio feedback on success/failure

### Enabling Voice Commands

#### Browser Setup
1. **Grant Microphone Permission**: Allow microphone access when prompted
2. **Supported Browsers**: Chrome, Edge, Safari (latest versions)
3. **Internet Connection**: Required for speech processing

#### App Settings
1. Go to Settings → Accessibility
2. Toggle "Voice Commands" to enabled
3. Test with the voice command button

### Available Commands

| Command | Action | Example Usage |
|---------|--------|---------------|
| `"check balance"` | View wallet balances | Opens wallet overview |
| `"send tokens"` | Initiate token transfer | Opens send flow |
| `"receive payment"` | Show receive address | Displays QR code |
| `"buy crypto"` | Open fiat on-ramp | Navigate to buy interface |
| `"sell crypto"` | Open fiat off-ramp | Navigate to sell interface |
| `"swap tokens"` | Token exchange | Opens swap interface |
| `"view transactions"` | Transaction history | Shows all transactions |
| `"stake tokens"` | Staking dashboard | Opens staking options |
| `"go to dashboard"` | Main dashboard | Returns to home |
| `"open settings"` | Settings page | Access preferences |

### Voice Command Tips

- **Speak Clearly**: Use normal speaking pace and volume
- **Quiet Environment**: Reduce background noise for better recognition
- **Wait for Prompt**: Listen for audio confirmation before speaking
- **Retry on Failure**: Commands can be repeated if not recognized
- **Fallback Available**: All voice commands have traditional UI alternatives

### Troubleshooting Voice Commands

#### Common Issues
- **No Microphone Access**: Check browser permissions
- **Commands Not Recognized**: Ensure clear pronunciation
- **Browser Not Supported**: Use Chrome, Edge, or Safari
- **Offline Mode**: Voice commands require internet connection

#### Error Messages
- `"Microphone access denied"` → Grant permissions in browser settings
- `"Voice recognition not supported"` → Update browser or try different one
- `"Command not recognized"` → Refer to command list above
- `"Network error"` → Check internet connection

## ♿ Accessibility Considerations

### WCAG 2.1 AA Compliance

Inkluziv meets or exceeds Web Content Accessibility Guidelines:

#### Perceivable
- **Color Contrast**: Minimum 4.5:1 ratio for normal text, 3:1 for large text
- **Scalable Text**: Font sizes from 14px to 22px
- **Alternative Text**: All images have descriptive alt text
- **Color Independence**: Information not conveyed by color alone

#### Operable
- **Keyboard Navigation**: All functionality accessible via keyboard
- **Touch Targets**: Minimum 44px for easy interaction
- **No Seizure Triggers**: No flashing content above 3Hz
- **Timeout Extensions**: Generous time limits with extensions

#### Understandable
- **Clear Language**: Simple, jargon-free instructions
- **Consistent Navigation**: Predictable interface patterns
- **Error Prevention**: Input validation with clear error messages
- **Help Documentation**: Comprehensive guidance available

#### Robust
- **Screen Reader Support**: Semantic HTML and ARIA labels
- **Browser Compatibility**: Works across modern browsers
- **Assistive Technology**: Compatible with NVDA, JAWS, VoiceOver
- **Progressive Enhancement**: Core functionality without JavaScript

### Assistive Technology Support

#### Screen Readers
- **NVDA** (Windows) - Full compatibility
- **JAWS** (Windows) - Comprehensive support
- **VoiceOver** (macOS/iOS) - Native integration
- **TalkBack** (Android) - Mobile accessibility

#### Input Methods
- **Voice Control** - Native voice command system
- **Switch Navigation** - Single-switch and dual-switch support
- **Eye Tracking** - Compatible with eye-gaze systems
- **Head Mouse** - Works with head-tracking devices

### Testing & Validation

- **Automated Testing**: axe-core accessibility testing
- **Manual Testing**: Real user testing with disabled users
- **Screen Reader Testing**: Verified with multiple screen readers
- **Keyboard Testing**: Complete keyboard-only navigation
- **Color Blind Testing**: Verified with color vision simulators

## 🤝 Contributing

We welcome contributions from developers of all backgrounds and abilities!

### Development Guidelines

1. **Accessibility First**: All features must be accessible
2. **Test with Assistive Technology**: Verify screen reader compatibility
3. **Follow WCAG Guidelines**: Maintain AA compliance
4. **Document Voice Commands**: Update command list for new features
5. **Inclusive Language**: Use person-first language in code and docs

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with accessibility in mind
4. Test with screen readers and keyboard navigation
5. Commit your changes: `git commit -m 'Add amazing accessible feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: Accessibility rules enforced
- **Prettier**: Consistent code formatting
- **Testing**: Include accessibility tests
- **Documentation**: Comment complex accessibility implementations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Web Accessibility Initiative (WAI)** for WCAG guidelines
- **Screen Reader Communities** for testing and feedback
- **Disability Rights Advocates** for inclusive design principles
- **Open Source Contributors** making the web accessible for all

## 📞 Support

- **Documentation**: [GitHub Wiki](https://github.com/your-username/inkluziv/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/inkluziv/issues)
- **Accessibility Feedback**: accessibility@inkluziv.com
- **Community**: [Discord Server](https://discord.gg/inkluziv)

---

<div align="center">
  <strong>Making DeFi accessible for everyone, everywhere.</strong>
  <br>
  Built with ❤️ for the global accessibility community
</div>