# HailBytes Password Strength Analyzer

[![WordPress Plugin Version](https://img.shields.io/badge/WordPress-5.0%2B-blue.svg)](https://wordpress.org)
[![PHP Version](https://img.shields.io/badge/PHP-7.4%2B-purple.svg)](https://php.net)
[![License](https://img.shields.io/badge/License-GPLv2-green.svg)](https://www.gnu.org/licenses/gpl-2.0.html)

Real-time password strength analysis with security awareness training. Check passwords against breach databases and educate users on cybersecurity best practices.

## 🔐 Key Features

- **Real-Time Analysis** - Instant password strength feedback as users type
- **Entropy Calculation** - Mathematical assessment using industry-standard algorithms
- **Breach Database Integration** - Check against 500+ million compromised passwords via HaveIBeenPwned API
- **Pattern Detection** - Identifies keyboard patterns, sequential numbers, repeated characters
- **Educational Content** - Built-in security awareness training
- **Lead Generation** - Integrated contact forms for security assessments
- **Privacy Focused** - All analysis performed client-side only
- **Mobile Responsive** - Works on all devices and screen sizes

## 📚 Educational Features

- Common attack method explanations (brute force, dictionary attacks, credential stuffing)
- Industry breach statistics and financial impact data
- Password best practices and security guidelines
- Multi-factor authentication promotion
- Interactive learning with real-time feedback

## 🛡️ Security & Compliance

- NIST 800-63B compliance checking
- Enterprise password policy validation
- PCI DSS, HIPAA, and SOX standard comparisons
- Zero password storage or transmission
- GDPR compliant design
- Secure k-anonymity model for breach checking

## 🚀 Installation

### WordPress Plugin Directory
1. Log in to your WordPress admin dashboard
2. Navigate to **Plugins → Add New**
3. Search for "HailBytes Password Strength Analyzer"
4. Click **Install Now** and then **Activate**

### Manual Installation
1. Download the plugin ZIP file
2. Upload via **Plugins → Add New → Upload Plugin**
3. Activate the plugin
4. Configure settings under **Settings → HailBytes PSA**

### Usage
Add the shortcode to any page or post:
```
[password_strength_analyzer]
```

## 🛠️ Technical Features

- **Entropy Calculation**: `log2(character_space^password_length)`
- **Time-to-crack estimation** based on current processing power
- **Weighted scoring system** with multiple factors
- **Dictionary word detection** with fuzzy matching
- **Keyboard pattern recognition** and sequential analysis
- **WCAG 2.1 accessibility** compliant
- **Progressive Web App** features
- **Translation ready** with internationalization support

## 🎨 Customization

### Shortcode Parameters
- `show_education="false"` - Hide educational content
- `show_leads="false"` - Disable lead capture forms
- `mode="quick"` - Show simplified interface
- `theme="dark"` - Switch to dark theme

### Themes
- Light theme (default)
- Dark theme
- Customizable via CSS custom properties

## 🔒 Privacy & Security

### Password Analysis
- All analysis performed client-side using JavaScript
- No passwords stored, logged, or transmitted
- Mathematical calculations use browser-only processing

### Breach Database Checking
- Uses HaveIBeenPwned API with k-anonymity model
- Only first 5 characters of SHA-1 hash transmitted
- Actual passwords never leave user's device

## 📊 Algorithm Details

The plugin uses advanced algorithms for comprehensive password analysis:

- **Shannon Entropy** for mathematical complexity assessment
- **NIST 800-63B guidelines** for compliance checking
- **Real-world attack modeling** for time-to-crack estimates
- **Pattern detection** based on security research
- **Regular updates** to threat databases

## 💼 Perfect For

- Security training companies and consultants
- Educational institutions and universities
- Corporate websites and intranets
- IT service providers and MSPs
- Cybersecurity awareness programs
- Employee onboarding and training

## 🤝 Contributing

We welcome contributions! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📞 Support

- **Documentation**: https://hailbytes.com/docs/password-analyzer
- **Support Email**: support@hailbytes.com
- **Security Training**: https://hailbytes.com/training

## 📄 License

This project is licensed under the GPL v2 or later - see the [LICENSE](https://www.gnu.org/licenses/gpl-2.0.html) file for details.

## 🏢 About HailBytes

HailBytes specializes in cybersecurity education and awareness programs. We're leaders in security training solutions for organizations of all sizes.

- **Website**: https://hailbytes.com
- **Privacy Policy**: https://hailbytes.com/privacy
- **Professional Services**: Custom integration development, security training programs, penetration testing

---

**Developed with ❤️ by [HailBytes](https://hailbytes.com)**

---

## Enterprise Support

[![HailBytes - Managed Security Awareness Training](https://hailbytes.com/images/icons/hb_hb_white_horizontal.png)](https://www.hailbytes.com/sat?utm_source=github&utm_medium=repo_readme&utm_campaign=hailbytes-password-analyzer&utm_content=enterprise_banner)

Running phishing simulations at scale? **HailBytes SAT** delivers managed GoPhish with enterprise support, on AWS and Azure Marketplaces.

[**Get Enterprise Support →**](https://www.hailbytes.com/sat?utm_source=github&utm_medium=repo_readme&utm_campaign=hailbytes-password-analyzer&utm_content=enterprise_banner)
