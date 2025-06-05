=== HailBytes Password Strength Analyzer ===
Contributors: hailbytes
Tags: password, security, strength, analyzer, cybersecurity, training, breach, authentication, enterprise, compliance
Requires at least: 5.0
Tested up to: 6.4
Stable tag: 1.0.0
Requires PHP: 7.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Real-time password strength analysis with security awareness training. Check passwords against breach databases and educate users on cybersecurity best practices.

== Description ==

The HailBytes Password Strength Analyzer is a comprehensive WordPress plugin that provides real-time password strength analysis combined with security awareness training. Perfect for organizations looking to improve their cybersecurity posture and educate users about password security.

**🔐 Key Features:**

* **Real-Time Analysis** - Instant password strength feedback as users type
* **Entropy Calculation** - Mathematical assessment of password complexity using industry-standard algorithms
* **Breach Database Integration** - Check passwords against 500+ million known compromised passwords using HaveIBeenPwned API
* **Pattern Detection** - Identifies keyboard patterns, sequential numbers, repeated characters, and common substitutions
* **Educational Content** - Built-in security awareness training and cybersecurity best practices
* **Lead Generation** - Integrated contact forms for security assessments and training inquiries
* **Multiple Display Modes** - Full analyzer, quick check, and training modes
* **Mobile Responsive** - Works perfectly on all devices and screen sizes
* **Privacy Focused** - All password analysis performed client-side only

**📚 Educational Features:**

* Common attack method explanations (brute force, dictionary attacks, credential stuffing)
* Industry breach statistics and financial impact data
* Password best practices and security guidelines
* Multi-factor authentication promotion and education
* Business impact education for decision makers
* Interactive learning with real-time feedback

**🛡️ Security & Compliance:**

* NIST 800-63B compliance checking
* Enterprise password policy validation
* PCI DSS, HIPAA, and SOX standard comparisons
* Zero password storage or transmission
* GDPR compliant design and data handling
* Secure k-anonymity model for breach checking

**💼 Business Features:**

* Lead capture system with CRM integration capabilities
* Security assessment request forms
* Training program promotion
* Usage analytics and reporting
* Custom branding options
* White-label friendly design

**🎨 Technical Features:**

* WCAG 2.1 accessibility compliant
* Progressive Web App features
* Customizable themes (light/dark mode)
* Translation ready with full internationalization support
* WordPress coding standards compliant
* Secure AJAX implementation with nonce verification

**Perfect For:**

* Security training companies and consultants
* Educational institutions and universities
* Corporate websites and intranets
* IT service providers and MSPs
* Cybersecurity awareness programs
* Compliance training initiatives
* Employee onboarding and training
* Client education and lead generation

**Advanced Algorithm Features:**

* Entropy calculation using log2(character_space^password_length)
* Time-to-crack estimation based on current processing power
* Weighted scoring system with multiple factors
* Dictionary word detection with fuzzy matching
* Keyboard pattern recognition and sequential analysis
* Common password substitution detection (@=a, 3=e, etc.)
* Unique character ratio analysis
* Length-based strength assessment

== Installation ==

**Automatic Installation:**

1. Log in to your WordPress admin dashboard
2. Navigate to Plugins → Add New
3. Search for "HailBytes Password Strength Analyzer"
4. Click "Install Now" and then "Activate"
5. Configure settings under Settings → HailBytes PSA
6. Add the shortcode `[password_strength_analyzer]` to any page or post

**Manual Installation:**

1. Download the plugin ZIP file
2. Upload the ZIP file through Plugins → Add New → Upload Plugin
3. Activate the plugin through the 'Plugins' screen
4. Configure settings under Settings → HailBytes PSA
5. Add the shortcode `[password_strength_analyzer]` to any page or post

**Configuration:**

1. Set notification email for lead capture
2. Enable/disable analytics tracking
3. Customize shortcode parameters as needed
4. Test functionality on a sample page

== Frequently Asked Questions ==

= Is password data stored or transmitted? =

No. All password analysis is performed entirely on the user's device using JavaScript. The only exception is the optional breach database check, which uses a secure k-anonymity model that only sends the first 5 characters of a SHA-1 hash to the HaveIBeenPwned API, ensuring your actual password is never transmitted.

= How does the breach database check work? =

We integrate with the HaveIBeenPwned API using their privacy-preserving k-anonymity model. When checking if a password has been compromised, we:
1. Generate a SHA-1 hash of the password locally
2. Send only the first 5 characters of the hash to the API
3. Receive a list of hash suffixes that match the prefix
4. Compare locally to determine if there's a match
This ensures your actual password never leaves your device.

= Can I customize the appearance and functionality? =

Yes! The plugin offers extensive customization options:
* Light and dark themes built-in
* Customizable colors using CSS custom properties
* Shortcode parameters for different display modes
* WordPress hooks and filters for advanced customization
* Custom scoring algorithms can be implemented
* Branding and messaging can be modified

= Is it mobile-friendly? =

Absolutely! The plugin is fully responsive and optimized for:
* Mobile phones and tablets
* Desktop computers and laptops
* Various screen sizes and orientations
* Touch and keyboard interactions
* Accessibility features for all users

= Can I disable certain features? =

Yes, you have complete control over features through shortcode parameters:
* `show_education="false"` - Hide educational content
* `show_leads="false"` - Disable lead capture forms
* `mode="quick"` - Show simplified interface
* `theme="dark"` - Switch to dark theme
* Custom CSS can hide or modify any elements

= Is it translation ready? =

The current version includes English text only, but the plugin architecture supports internationalization. Translation files can be added for different languages, and the plugin follows WordPress translation best practices.

= How accurate is the strength analysis? =

Our algorithm uses industry-standard calculations including:
* Shannon entropy for mathematical complexity assessment
* NIST 800-63B guidelines for compliance checking
* Real-world attack modeling for time-to-crack estimates
* Comprehensive pattern detection based on security research
* Regular updates to threat databases and algorithms

= Can I integrate this with my CRM or marketing tools? =

Yes! The plugin provides:
* Lead data export capabilities
* WordPress hooks for custom integrations
* Email notifications for new leads
* Database storage with standard WordPress tables
* API endpoints for external system integration

= Does this work with caching plugins? =

Yes, the plugin is designed to work with all major caching solutions:
* Static assets are properly versioned
* JavaScript functionality works with cached pages
* AJAX requests bypass caching appropriately
* No database queries on frontend display

= What about GDPR compliance? =

The plugin is designed with privacy in mind:
* No passwords are stored, logged, or transmitted
* Lead capture forms only collect voluntarily provided information
* Users can control what data they share
* Privacy notices are built into the interface
* Data retention policies can be configured

== Screenshots ==

1. **Real-time password analysis** - Interactive password input with live strength feedback, visual meter, and scoring system
2. **Detailed analysis dashboard** - Comprehensive breakdown of password composition, entropy calculation, and pattern detection
3. **Educational content panel** - Security awareness training with attack method explanations and best practices
4. **Breach database results** - Integration with HaveIBeenPwned showing compromise status and occurrence frequency
5. **Lead capture system** - Professional contact forms for security assessments and training inquiries
6. **Admin dashboard** - Settings panel with lead management, analytics, and configuration options
7. **Mobile responsive design** - Optimized interface across phones, tablets, and desktop devices
8. **Dark theme interface** - Professional dark mode with full feature compatibility

== Changelog ==

= 1.0.0 (2024-12-16) =
* **Initial Release**
* Real-time password strength analysis with entropy calculation
* Breach database integration using HaveIBeenPwned API
* Comprehensive educational content system
* Lead capture functionality with email notifications
* Multi-theme support (light/dark modes)
* Responsive design for all devices
* WCAG 2.1 accessibility compliance
* Pattern detection and dictionary analysis
* Time-to-crack estimation algorithms
* NIST 800-63B compliance checking
* Admin dashboard with settings and lead management
* Shortcode implementation with customizable parameters
* AJAX-powered smooth user experience
* Security best practices throughout codebase

= Future Updates =
* Multi-language support and translation files
* Additional compliance standard checks (PCI DSS, HIPAA)
* Enhanced analytics and reporting features
* API endpoints for external integrations
* Custom branding and white-label options
* Advanced pattern detection algorithms
* Integration with popular form plugins
* Scheduled security awareness email campaigns

== Upgrade Notice ==

= 1.0.0 =
Initial release of the HailBytes Password Strength Analyzer plugin. Install now to start improving password security awareness and capturing qualified security training leads.

== Privacy Policy ==

This plugin is designed with privacy and security as core principles:

**Password Analysis:**
* All password strength analysis is performed entirely on the user's device
* No passwords are stored, logged, transmitted, or accessible to administrators
* Mathematical calculations use client-side JavaScript only
* No server-side processing of sensitive password data

**Breach Database Checking:**
* Uses the HaveIBeenPwned API with privacy-preserving k-anonymity model
* Only the first 5 characters of a SHA-1 hash are transmitted
* Actual passwords never leave the user's device
* API queries are not logged or stored

**Lead Capture:**
* Contact forms only collect information users voluntarily provide
* Standard WordPress database storage with proper sanitization
* Email notifications sent to designated administrators only
* Users control what personal information they share

**Analytics and Tracking:**
* Optional anonymous usage analytics can be enabled/disabled
* No personally identifiable information collected in analytics
* Standard WordPress admin capabilities for data management
* Complies with GDPR, CCPA, and other privacy regulations

**Data Retention:**
* Lead data stored until manually deleted by administrators
* No automatic data expiration or external data sharing
* Standard WordPress data export and deletion capabilities
* Users can request data removal through standard channels

For complete privacy information, visit: https://hailbytes.com/privacy

== Support ==

**Documentation and Resources:**
* Plugin Documentation: https://hailbytes.com/docs/password-analyzer
* Security Training Programs: https://hailbytes.com/training
* Cybersecurity Resources: https://hailbytes.com/resources

**Support Channels:**
* WordPress Plugin Support Forum
* Direct Email: support@hailbytes.com
* Knowledge Base: https://support.hailbytes.com
* Video Tutorials: https://hailbytes.com/tutorials

**Professional Services:**
* Custom Integration Development
* Security Awareness Training Programs
* Penetration Testing and Assessments
* Compliance Consulting and Audits

== Credits ==

**Security Research:**
* HaveIBeenPwned API for breach database integration
* NIST 800-63B guidelines for password standards
* OWASP Foundation for security best practices
* Security research community for algorithm development

**WordPress Development:**
* WordPress coding standards and best practices
* Accessibility guidelines (WCAG 2.1)
* Internationalization and localization support
* Plugin security and performance optimization

**Design and User Experience:**
* Modern web design principles and trends
* Mobile-first responsive design approach
* User accessibility and inclusive design
* Progressive web application features

This plugin is developed and maintained by HailBytes Security Training - Leaders in cybersecurity education and awareness programs.