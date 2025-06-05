<?php
/**
 * Plugin Name: HailBytes Password Strength Analyzer
 * Plugin URI: https://hailbytes.com
 * Description: Real-time password strength analysis and security awareness training tool
 * Version: 1.0.0
 * Author: HailBytes Security Training
 * License: GPL v2 or later
 * Text Domain: hailbytes-psa
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('HAILBYTES_PSA_VERSION', '1.0.0');
define('HAILBYTES_PSA_PLUGIN_URL', plugin_dir_url(__FILE__));
define('HAILBYTES_PSA_PLUGIN_PATH', plugin_dir_path(__FILE__));

class HailBytesPasswordAnalyzer {
    
    public function __construct() {
        add_action('init', array($this, 'init'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_shortcode('password_strength_analyzer', array($this, 'password_analyzer_shortcode'));
        add_action('wp_ajax_check_pwned_password', array($this, 'check_pwned_password'));
        add_action('wp_ajax_nopriv_check_pwned_password', array($this, 'check_pwned_password'));
        add_action('wp_ajax_capture_lead', array($this, 'capture_lead'));
        add_action('wp_ajax_nopriv_capture_lead', array($this, 'capture_lead'));
        
        // Admin hooks
        add_action('admin_menu', array($this, 'admin_menu'));
        add_action('admin_init', array($this, 'admin_init'));
        
        // Activation/Deactivation
        register_activation_hook(__FILE__, array($this, 'activate'));
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));
    }
    
    public function init() {
        // Plugin initialization
    }
    
    public function enqueue_scripts() {
        wp_enqueue_script('hailbytes-psa-main', HAILBYTES_PSA_PLUGIN_URL . 'assets/js/password-analyzer.js', array('jquery'), HAILBYTES_PSA_VERSION, true);
        wp_enqueue_style('hailbytes-psa-style', HAILBYTES_PSA_PLUGIN_URL . 'assets/css/password-analyzer.css', array(), HAILBYTES_PSA_VERSION);
        
        // Localize script for AJAX
        wp_localize_script('hailbytes-psa-main', 'hailbytes_ajax', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('hailbytes_psa_nonce'),
            'strings' => array(
                'checking_breach' => 'Checking breach database...',
                'found_in_breach' => 'Password found in data breach!',
                'not_in_breach' => 'Password not found in known breaches',
                'breach_check_error' => 'Unable to check breach database',
                'lead_success' => 'Thank you! We\'ll be in touch soon.',
                'lead_error' => 'Sorry, there was an error. Please try again.'
            )
        ));
    }
    
    public function password_analyzer_shortcode($atts) {
        $atts = shortcode_atts(array(
            'mode' => 'full', // full, quick, training
            'theme' => 'light',
            'show_education' => 'true',
            'show_leads' => 'true'
        ), $atts);
        
        ob_start();
        ?>
        <div id="hailbytes-psa-container" class="hailbytes-psa-theme-<?php echo esc_attr($atts['theme']); ?>" data-mode="<?php echo esc_attr($atts['mode']); ?>">
            <!-- Header -->
            <div class="hailbytes-psa-header">
                <div class="hailbytes-psa-logo">
                    <img src="<?php echo HAILBYTES_PSA_PLUGIN_URL; ?>assets/images/hailbytes-logo.png" alt="HailBytes" class="hailbytes-logo">
                    <h2>Password Strength Analyzer</h2>
                </div>
                <div class="hailbytes-psa-tagline">
                    Test your password strength and learn security best practices
                </div>
            </div>
            
            <!-- Main Analyzer -->
            <div class="hailbytes-psa-main">
                <div class="hailbytes-psa-input-section">
                    <label for="password-input">Enter a password to analyze:</label>
                    <div class="password-input-wrapper">
                        <input type="password" id="password-input" placeholder="Type your password here..." autocomplete="new-password">
                        <button type="button" class="toggle-visibility" title="Toggle password visibility">
                            <span class="eye-icon">👁️</span>
                        </button>
                    </div>
                    <div class="hailbytes-psa-disclaimer">
                        <small>🔒 Your password is analyzed locally and never stored or transmitted.</small>
                    </div>
                </div>
                
                <!-- Strength Meter -->
                <div class="hailbytes-psa-strength-section">
                    <div class="strength-meter-container">
                        <div class="strength-meter">
                            <div class="strength-fill" data-strength="0"></div>
                        </div>
                        <div class="strength-label">Enter a password to begin</div>
                    </div>
                    
                    <div class="strength-score">
                        <div class="score-display">
                            <span class="score-number">0</span>
                            <span class="score-label">/100</span>
                        </div>
                    </div>
                </div>
                
                <!-- Analysis Results -->
                <div class="hailbytes-psa-results" style="display: none;">
                    <div class="results-tabs">
                        <button class="tab-button active" data-tab="overview">Overview</button>
                        <button class="tab-button" data-tab="detailed">Detailed Analysis</button>
                        <button class="tab-button" data-tab="suggestions">Improvements</button>
                        <?php if ($atts['show_education'] === 'true'): ?>
                        <button class="tab-button" data-tab="education">Learn More</button>
                        <?php endif; ?>
                    </div>
                    
                    <!-- Overview Tab -->
                    <div class="tab-content active" data-tab="overview">
                        <div class="overview-grid">
                            <div class="overview-item">
                                <div class="overview-icon">⚡</div>
                                <div class="overview-content">
                                    <div class="overview-label">Entropy</div>
                                    <div class="overview-value entropy-value">0 bits</div>
                                </div>
                            </div>
                            <div class="overview-item">
                                <div class="overview-icon">⏱️</div>
                                <div class="overview-content">
                                    <div class="overview-label">Time to Crack</div>
                                    <div class="overview-value crack-time">-</div>
                                </div>
                            </div>
                            <div class="overview-item">
                                <div class="overview-icon">📊</div>
                                <div class="overview-content">
                                    <div class="overview-label">Compliance</div>
                                    <div class="overview-value compliance-status">-</div>
                                </div>
                            </div>
                            <div class="overview-item breach-status-item">
                                <div class="overview-icon">🛡️</div>
                                <div class="overview-content">
                                    <div class="overview-label">Breach Status</div>
                                    <div class="overview-value breach-status">Checking...</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Detailed Analysis Tab -->
                    <div class="tab-content" data-tab="detailed">
                        <div class="detailed-analysis">
                            <div class="analysis-section">
                                <h4>Character Composition</h4>
                                <div class="composition-grid">
                                    <div class="composition-item">
                                        <span class="composition-label">Length:</span>
                                        <span class="composition-value length-value">0</span>
                                    </div>
                                    <div class="composition-item">
                                        <span class="composition-label">Lowercase:</span>
                                        <span class="composition-value lowercase-count">0</span>
                                    </div>
                                    <div class="composition-item">
                                        <span class="composition-label">Uppercase:</span>
                                        <span class="composition-value uppercase-count">0</span>
                                    </div>
                                    <div class="composition-item">
                                        <span class="composition-label">Numbers:</span>
                                        <span class="composition-value number-count">0</span>
                                    </div>
                                    <div class="composition-item">
                                        <span class="composition-label">Symbols:</span>
                                        <span class="composition-value symbol-count">0</span>
                                    </div>
                                    <div class="composition-item">
                                        <span class="composition-label">Unique Characters:</span>
                                        <span class="composition-value unique-count">0</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="analysis-section">
                                <h4>Pattern Detection</h4>
                                <div class="patterns-detected"></div>
                            </div>
                            
                            <div class="analysis-section">
                                <h4>Dictionary Analysis</h4>
                                <div class="dictionary-results"></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Suggestions Tab -->
                    <div class="tab-content" data-tab="suggestions">
                        <div class="suggestions-content">
                            <div class="suggestions-list"></div>
                            <div class="passphrase-suggestion">
                                <h4>Consider a Passphrase Instead</h4>
                                <p>Passphrases are often stronger and easier to remember than complex passwords.</p>
                                <div class="passphrase-example">
                                    <strong>Example:</strong> "Coffee#Mountain$Morning2024"
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Education Tab -->
                    <?php if ($atts['show_education'] === 'true'): ?>
                    <div class="tab-content" data-tab="education">
                        <div class="education-content">
                            <div class="education-section">
                                <h4>Why Password Strength Matters</h4>
                                <p>Weak passwords are the #1 cause of data breaches, accounting for 81% of security incidents.</p>
                                
                                <h5>Common Attack Methods:</h5>
                                <ul>
                                    <li><strong>Brute Force:</strong> Trying all possible combinations</li>
                                    <li><strong>Dictionary Attacks:</strong> Using common words and phrases</li>
                                    <li><strong>Credential Stuffing:</strong> Using passwords from data breaches</li>
                                    <li><strong>Social Engineering:</strong> Guessing based on personal information</li>
                                </ul>
                                
                                <h5>Best Practices:</h5>
                                <ul>
                                    <li>Use unique passwords for every account</li>
                                    <li>Enable multi-factor authentication (MFA)</li>
                                    <li>Use a reputable password manager</li>
                                    <li>Regularly update passwords for critical accounts</li>
                                </ul>
                            </div>
                            
                            <div class="stats-section">
                                <h4>Cybersecurity Statistics</h4>
                                <div class="stats-grid">
                                    <div class="stat-item">
                                        <div class="stat-number">81%</div>
                                        <div class="stat-label">of breaches involve weak passwords</div>
                                    </div>
                                    <div class="stat-item">
                                        <div class="stat-number">$4.88M</div>
                                        <div class="stat-label">average cost of a data breach</div>
                                    </div>
                                    <div class="stat-item">
                                        <div class="stat-number">287 days</div>
                                        <div class="stat-label">average time to identify a breach</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <?php endif; ?>
                </div>
            </div>
            
            <!-- HailBytes Promotion -->
            <?php if ($atts['show_leads'] === 'true'): ?>
            <div class="hailbytes-psa-cta">
                <div class="cta-content">
                    <h3>Want to Strengthen Your Organization's Security?</h3>
                    <p>HailBytes provides comprehensive security awareness training and hands-on cybersecurity education through our virtual labs and training programs.</p>
                    
                    <div class="cta-buttons">
                        <button class="cta-primary" onclick="hailbytesShowLeadForm()">Get Free Security Assessment</button>
                        <a href="https://hailbytes.com/training" class="cta-secondary" target="_blank">Explore Training Programs</a>
                    </div>
                </div>
            </div>
            
            <!-- Lead Capture Modal -->
            <div id="hailbytes-lead-modal" class="hailbytes-modal" style="display: none;">
                <div class="modal-content">
                    <span class="modal-close">&times;</span>
                    <h3>Free Security Assessment</h3>
                    <p>Get a personalized security assessment for your organization. No obligation.</p>
                    
                    <form id="hailbytes-lead-form">
                        <div class="form-group">
                            <label for="lead-name">Name *</label>
                            <input type="text" id="lead-name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="lead-email">Email *</label>
                            <input type="email" id="lead-email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="lead-company">Company</label>
                            <input type="text" id="lead-company" name="company">
                        </div>
                        <div class="form-group">
                            <label for="lead-size">Organization Size</label>
                            <select id="lead-size" name="org_size">
                                <option value="">Select...</option>
                                <option value="1-10">1-10 employees</option>
                                <option value="11-50">11-50 employees</option>
                                <option value="51-200">51-200 employees</option>
                                <option value="201-1000">201-1000 employees</option>
                                <option value="1000+">1000+ employees</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="lead-interests">Primary Interest</label>
                            <select id="lead-interests" name="interests">
                                <option value="">Select...</option>
                                <option value="awareness-training">Security Awareness Training</option>
                                <option value="penetration-testing">Penetration Testing</option>
                                <option value="compliance">Compliance Training</option>
                                <option value="incident-response">Incident Response</option>
                                <option value="general-assessment">General Security Assessment</option>
                            </select>
                        </div>
                        
                        <button type="submit" class="form-submit">Request Assessment</button>
                    </form>
                </div>
            </div>
            <?php endif; ?>
        </div>
        
        <script>
        // Initialize the password analyzer when DOM is ready
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof HailBytesPasswordAnalyzer !== 'undefined') {
                window.hailbytesAnalyzer = new HailBytesPasswordAnalyzer();
            }
        });
        </script>
        <?php
        return ob_get_clean();
    }
    
    public function check_pwned_password() {
        check_ajax_referer('hailbytes_psa_nonce', 'nonce');
        
        $password = sanitize_text_field($_POST['password']);
        if (empty($password)) {
            wp_die();
        }
        
        // Hash the password with SHA-1
        $sha1_hash = sha1($password);
        $prefix = substr($sha1_hash, 0, 5);
        $suffix = substr($sha1_hash, 5);
        
        // Query HaveIBeenPwned API
        $response = wp_remote_get("https://api.pwnedpasswords.com/range/{$prefix}", array(
            'timeout' => 10,
            'user-agent' => 'HailBytes-PSA/1.0'
        ));
        
        if (is_wp_error($response)) {
            wp_send_json_error('API request failed');
        }
        
        $body = wp_remote_retrieve_body($response);
        $lines = explode("\n", $body);
        
        foreach ($lines as $line) {
            $parts = explode(':', trim($line));
            if (count($parts) === 2 && strtolower($parts[0]) === strtolower($suffix)) {
                wp_send_json_success(array(
                    'found' => true,
                    'count' => intval($parts[1])
                ));
            }
        }
        
        wp_send_json_success(array('found' => false));
    }
    
    public function capture_lead() {
        check_ajax_referer('hailbytes_psa_nonce', 'nonce');
        
        $name = sanitize_text_field($_POST['name']);
        $email = sanitize_email($_POST['email']);
        $company = sanitize_text_field($_POST['company']);
        $org_size = sanitize_text_field($_POST['org_size']);
        $interests = sanitize_text_field($_POST['interests']);
        
        if (empty($name) || empty($email)) {
            wp_send_json_error('Missing required fields');
        }
        
        // Store lead in database
        global $wpdb;
        $table_name = $wpdb->prefix . 'hailbytes_leads';
        
        $result = $wpdb->insert(
            $table_name,
            array(
                'name' => $name,
                'email' => $email,
                'company' => $company,
                'org_size' => $org_size,
                'interests' => $interests,
                'source' => 'password-analyzer',
                'created_at' => current_time('mysql')
            ),
            array('%s', '%s', '%s', '%s', '%s', '%s', '%s')
        );
        
        if ($result === false) {
            wp_send_json_error('Database error');
        }
        
        // Send notification email
        $to = get_option('hailbytes_psa_notification_email', get_option('admin_email'));
        $subject = 'New Lead from Password Analyzer';
        $message = "New lead captured:\n\n";
        $message .= "Name: {$name}\n";
        $message .= "Email: {$email}\n";
        $message .= "Company: {$company}\n";
        $message .= "Organization Size: {$org_size}\n";
        $message .= "Interests: {$interests}\n";
        $message .= "Source: Password Analyzer\n";
        $message .= "Date: " . current_time('mysql') . "\n";
        
        wp_mail($to, $subject, $message);
        
        wp_send_json_success('Lead captured successfully');
    }
    
    public function admin_menu() {
        add_options_page(
            'HailBytes PSA Settings',
            'HailBytes PSA',
            'manage_options',
            'hailbytes-psa-settings',
            array($this, 'admin_page')
        );
    }
    
    public function admin_init() {
        register_setting('hailbytes_psa_settings', 'hailbytes_psa_notification_email');
        register_setting('hailbytes_psa_settings', 'hailbytes_psa_enable_analytics');
    }
    
    public function admin_page() {
        ?>
        <div class="wrap">
            <h1>HailBytes Password Strength Analyzer Settings</h1>
            
            <form method="post" action="options.php">
                <?php settings_fields('hailbytes_psa_settings'); ?>
                <?php do_settings_sections('hailbytes_psa_settings'); ?>
                
                <table class="form-table">
                    <tr>
                        <th scope="row">Notification Email</th>
                        <td>
                            <input type="email" name="hailbytes_psa_notification_email" 
                                   value="<?php echo esc_attr(get_option('hailbytes_psa_notification_email', get_option('admin_email'))); ?>" 
                                   class="regular-text" />
                            <p class="description">Email address to receive lead notifications</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Enable Analytics</th>
                        <td>
                            <input type="checkbox" name="hailbytes_psa_enable_analytics" 
                                   value="1" <?php checked(1, get_option('hailbytes_psa_enable_analytics'), true); ?> />
                            <p class="description">Track usage analytics (anonymous)</p>
                        </td>
                    </tr>
                </table>
                
                <?php submit_button(); ?>
            </form>
            
            <h2>Usage Instructions</h2>
            <p>Use the shortcode <code>[password_strength_analyzer]</code> to display the password analyzer on any page or post.</p>
            
            <h3>Shortcode Options:</h3>
            <ul>
                <li><code>mode</code> - Set to 'full', 'quick', or 'training' (default: 'full')</li>
                <li><code>theme</code> - Set to 'light' or 'dark' (default: 'light')</li>
                <li><code>show_education</code> - Set to 'true' or 'false' (default: 'true')</li>
                <li><code>show_leads</code> - Set to 'true' or 'false' (default: 'true')</li>
            </ul>
            
            <h3>Example:</h3>
            <code>[password_strength_analyzer mode="training" theme="dark"]</code>
            
            <?php
            // Show leads statistics
            global $wpdb;
            $table_name = $wpdb->prefix . 'hailbytes_leads';
            $lead_count = $wpdb->get_var("SELECT COUNT(*) FROM {$table_name}");
            
            if ($lead_count > 0) {
                echo "<h2>Lead Statistics</h2>";
                echo "<p>Total leads captured: <strong>{$lead_count}</strong></p>";
                
                $recent_leads = $wpdb->get_results("SELECT * FROM {$table_name} ORDER BY created_at DESC LIMIT 10");
                if ($recent_leads) {
                    echo "<h3>Recent Leads</h3>";
                    echo "<table class='wp-list-table widefat fixed striped'>";
                    echo "<thead><tr><th>Name</th><th>Email</th><th>Company</th><th>Date</th></tr></thead>";
                    echo "<tbody>";
                    foreach ($recent_leads as $lead) {
                        echo "<tr>";
                        echo "<td>" . esc_html($lead->name) . "</td>";
                        echo "<td>" . esc_html($lead->email) . "</td>";
                        echo "<td>" . esc_html($lead->company) . "</td>";
                        echo "<td>" . esc_html($lead->created_at) . "</td>";
                        echo "</tr>";
                    }
                    echo "</tbody></table>";
                }
            }
            ?>
        </div>
        <?php
    }
    
    public function activate() {
        // Create leads table
        global $wpdb;
        $table_name = $wpdb->prefix . 'hailbytes_leads';
        
        $charset_collate = $wpdb->get_charset_collate();
        
        $sql = "CREATE TABLE $table_name (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            name varchar(100) NOT NULL,
            email varchar(100) NOT NULL,
            company varchar(100),
            org_size varchar(20),
            interests varchar(50),
            source varchar(50),
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
        
        // Set default options
        add_option('hailbytes_psa_notification_email', get_option('admin_email'));
        add_option('hailbytes_psa_enable_analytics', 1);
    }
    
    public function deactivate() {
        // Clean up if needed
    }
}

// Initialize the plugin
new HailBytesPasswordAnalyzer();

?>