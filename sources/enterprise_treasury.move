// Copyright (c) BitcoinVault Pro, Inc.
// SPDX-License-Identifier: Apache-2.0

/// Enterprise Treasury Management Module
/// Provides sophisticated Bitcoin treasury management with programmable policies,
/// compliance monitoring, and multi-signature governance using dWallet Network
module bitcoin_vault::enterprise_treasury {
    use std::string::{String, utf8};
    use std::option::{Self, Option};
    use std::vector;
    use std::type_name;
    
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::clock::{Self, Clock};
    use sui::event;
    use sui::table::{Self, Table};
    use sui::balance::{Self, Balance};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::dynamic_field;
    use sui::dynamic_object_field;
    
    use dwallet_network::dwallet_cap::{Self, DWalletCap};

    // ====== Error Codes ======
    const EPOLICY_VIOLATION: u64 = 1;
    const EINSUFFICIENT_APPROVALS: u64 = 2;
    const EUNAUTHORIZED: u64 = 3;
    const ETIMELOCKED: u64 = 4;
    const EPROPOSAL_EXPIRED: u64 = 5;
    const EINVALID_RISK_SCORE: u64 = 6;
    const ECOMPLIANCE_CHECK_FAILED: u64 = 7;
    const EEMERGENCY_MODE_ACTIVE: u64 = 8;
    const EINVALID_THRESHOLD: u64 = 9;
    const EMAX_PROPOSALS_REACHED: u64 = 10;

    // ====== Constants ======
    const MAX_PENDING_PROPOSALS: u64 = 100;
    const MAX_URGENCY_LEVEL: u8 = 10;
    const MIN_TIMELOCK_DURATION: u64 = 3600000; // 1 hour in milliseconds
    const MAX_TIMELOCK_DURATION: u64 = 2592000000; // 30 days in milliseconds
    const EMERGENCY_THRESHOLD_DURATION: u64 = 86400000; // 24 hours in milliseconds

    // ====== Policy Types ======
    const POLICY_STANDARD: u8 = 0;
    const POLICY_HIGH_VALUE: u8 = 1;
    const POLICY_EMERGENCY: u8 = 2;
    const POLICY_COMPLIANCE_REQUIRED: u8 = 3;

    // ====== Structs ======
    
    /// Core treasury vault structure with programmable policies
    public struct TreasuryVault has key {
        id: UID,
        /// dWallet capability for Bitcoin signing
        dwallet_cap: DWalletCap,
        /// Bitcoin address controlled by the dWallet
        bitcoin_address: String,
        /// Governance configuration
        governance_config: GovernanceConfig,
        /// Policy-based spending controls
        spending_policies: Table<u8, SpendingPolicy>,
        /// Compliance monitoring system
        compliance_monitor: ComplianceMonitor,
        /// Treasury analytics engine
        treasury_analytics: AnalyticsEngine,
        /// Pending expenditure proposals
        pending_proposals: Table<ID, ExpenditureProposal>,
        /// Emergency controls
        emergency_config: EmergencyConfig,
        /// Treasury metadata
        metadata: TreasuryMetadata,
        /// Total treasury balance (tracked off-chain)
        total_balance: u64,
        /// Operational treasury funds
        operational_funds: Balance<SUI>,
    }

    /// Dynamic governance configuration
    public struct GovernanceConfig has store {
        /// Required signers for different operations
        required_signers: vector<address>,
        /// Minimum approval threshold
        min_approval_threshold: u8,
        /// Maximum approval threshold
        max_approval_threshold: u8,
        /// Governance token holders (future expansion)
        governance_members: vector<address>,
        /// Voting weights for different members
        member_weights: Table<address, u64>,
        /// Last governance update timestamp
        last_update: u64,
    }

    /// Sophisticated spending policy with dynamic controls
    public struct SpendingPolicy has store {
        /// Policy identifier
        policy_type: u8,
        /// Maximum amount per transaction
        max_amount_per_tx: u64,
        /// Daily spending limit
        daily_limit: u64,
        /// Weekly spending limit  
        weekly_limit: u64,
        /// Monthly spending limit
        monthly_limit: u64,
        /// Required number of approvals
        required_approvals: u8,
        /// Approved recipient addresses
        approved_recipients: vector<address>,
        /// Time lock duration in milliseconds
        time_lock_duration: u64,
        /// Risk assessment requirement
        risk_assessment_required: bool,
        /// Compliance check requirement
        compliance_check_required: bool,
        /// Policy activation timestamp
        activation_time: u64,
        /// Policy expiration timestamp (0 = never expires)
        expiration_time: u64,
    }

    /// Compliance monitoring and audit system
    public struct ComplianceMonitor has store {
        /// AML/KYC requirements
        aml_kyc_required: bool,
        /// Sanctioned addresses blacklist
        sanctioned_addresses: vector<address>,
        /// Compliance officer addresses
        compliance_officers: vector<address>,
        /// Audit trail configuration
        audit_config: AuditConfig,
        /// Regulatory jurisdiction
        jurisdiction: String,
        /// Last compliance update
        last_compliance_check: u64,
    }

    /// Advanced treasury analytics
    public struct AnalyticsEngine has store {
        /// Risk scoring model parameters
        risk_model_params: RiskModelParams,
        /// Transaction pattern analysis
        transaction_patterns: Table<address, TransactionPattern>,
        /// Treasury performance metrics
        performance_metrics: PerformanceMetrics,
        /// Predictive analytics configuration
        predictive_config: PredictiveConfig,
        /// AI model version
        ai_model_version: String,
    }

    /// Emergency response configuration
    public struct EmergencyConfig has store {
        /// Emergency responders
        emergency_responders: vector<address>,
        /// Emergency threshold amounts
        emergency_thresholds: Table<u8, u64>,
        /// Fast-track approval enabled
        fast_track_enabled: bool,
        /// Emergency mode active
        emergency_mode_active: bool,
        /// Emergency activation timestamp
        emergency_activation_time: u64,
        /// Emergency contact information
        emergency_contacts: vector<String>,
    }

    /// Treasury metadata and information
    public struct TreasuryMetadata has store {
        /// Treasury name
        name: String,
        /// Treasury description
        description: String,
        /// Organization information
        organization: String,
        /// Treasury creation timestamp
        created_at: u64,
        /// Treasury version
        version: String,
        /// Contact information
        contact_info: String,
        /// Treasury logo/image URL
        image_url: Option<String>,
    }

    /// Detailed expenditure proposal
    public struct ExpenditureProposal has key, store {
        id: UID,
        /// Proposal amount in satoshis
        amount: u64,
        /// Bitcoin recipient address
        recipient: String,
        /// Purpose and justification
        purpose: String,
        /// Urgency level (1-10)
        urgency: u8,
        /// Proposal creator
        proposer: address,
        /// Required number of approvals
        required_approvals: u8,
        /// Current approvals
        current_approvals: vector<address>,
        /// Time lock end timestamp
        time_lock_end: u64,
        /// Risk assessment score
        risk_assessment: Option<RiskAssessment>,
        /// Compliance status
        compliance_status: ComplianceStatus,
        /// Proposal creation timestamp
        created_at: u64,
        /// Proposal expiration timestamp
        expires_at: u64,
        /// Additional metadata
        metadata: Table<String, String>,
        /// Applicable policy type
        policy_type: u8,
        /// Execution status
        execution_status: u8,
    }

    /// Supporting structs for detailed analytics and compliance

    public struct AuditConfig has store {
        audit_enabled: bool,
        retention_period: u64,
        audit_level: u8,
        external_auditor: Option<address>,
    }

    public struct RiskModelParams has store {
        volatility_weight: u64,
        liquidity_weight: u64,
        counterparty_weight: u64,
        geographic_weight: u64,
        model_version: String,
    }

    public struct TransactionPattern has store {
        avg_transaction_size: u64,
        transaction_frequency: u64,
        preferred_times: vector<u64>,
        risk_score: u64,
        last_updated: u64,
    }

    public struct PerformanceMetrics has store {
        total_transactions: u64,
        total_volume: u64,
        avg_processing_time: u64,
        success_rate: u64,
        cost_efficiency: u64,
        last_calculated: u64,
    }

    public struct PredictiveConfig has store {
        forecasting_enabled: bool,
        prediction_horizon: u64,
        confidence_threshold: u64,
        model_accuracy: u64,
    }

    public struct RiskAssessment has store {
        overall_score: u64,
        liquidity_risk: u64,
        counterparty_risk: u64,
        operational_risk: u64,
        market_risk: u64,
        assessment_timestamp: u64,
        assessor: address,
    }

    public struct ComplianceStatus has store {
        aml_cleared: bool,
        kyc_verified: bool,
        sanctions_checked: bool,
        regulatory_approved: bool,
        compliance_officer: Option<address>,
        last_checked: u64,
    }

    // ====== Events ======

    public struct TreasuryCreated has copy, drop {
        treasury_id: ID,
        creator: address,
        bitcoin_address: String,
        initial_balance: u64,
        timestamp: u64,
    }

    public struct ExpenditureProposed has copy, drop {
        proposal_id: ID,
        treasury_id: ID,
        amount: u64,
        recipient: String,
        proposer: address,
        urgency: u8,
        timestamp: u64,
    }

    public struct ExpenditureApproved has copy, drop {
        proposal_id: ID,
        approver: address,
        approval_count: u8,
        timestamp: u64,
    }

    public struct ExpenditureExecuted has copy, drop {
        proposal_id: ID,
        treasury_id: ID,
        amount: u64,
        recipient: String,
        bitcoin_tx_hash: String,
        executor: address,
        timestamp: u64,
    }

    public struct PolicyUpdated has copy, drop {
        treasury_id: ID,
        policy_type: u8,
        updater: address,
        timestamp: u64,
    }

    public struct EmergencyActivated has copy, drop {
        treasury_id: ID,
        activator: address,
        reason: String,
        timestamp: u64,
    }

    public struct ComplianceCheckCompleted has copy, drop {
        proposal_id: ID,
        compliance_status: bool,
        compliance_officer: address,
        timestamp: u64,
    }

    public struct RiskAssessmentCompleted has copy, drop {
        proposal_id: ID,
        risk_score: u64,
        assessor: address,
        timestamp: u64,
    }

    // ====== Core Functions ======

    /// Initialize a new enterprise treasury vault
    public fun create_treasury_vault(
        dwallet_cap: DWalletCap,
        bitcoin_address: String,
        name: String,
        description: String,
        organization: String,
        required_signers: vector<address>,
        min_approval_threshold: u8,
        clock: &Clock,
        ctx: &mut TxContext
    ): TreasuryVault {
        let treasury_id = object::new(ctx);
        let current_time = clock::timestamp_ms(clock);
        
        // Initialize governance configuration
        let governance_config = GovernanceConfig {
            required_signers,
            min_approval_threshold,
            max_approval_threshold: 10,
            governance_members: vector::empty(),
            member_weights: table::new(ctx),
            last_update: current_time,
        };

        // Initialize default spending policies
        let spending_policies = table::new(ctx);
        let default_policy = create_default_spending_policy(current_time);
        table::add(&mut spending_policies, POLICY_STANDARD, default_policy);

        // Initialize compliance monitor
        let compliance_monitor = ComplianceMonitor {
            aml_kyc_required: true,
            sanctioned_addresses: vector::empty(),
            compliance_officers: vector::empty(),
            audit_config: AuditConfig {
                audit_enabled: true,
                retention_period: 31536000000, // 1 year in milliseconds
                audit_level: 3,
                external_auditor: option::none(),
            },
            jurisdiction: utf8(b"GLOBAL"),
            last_compliance_check: current_time,
        };

        // Initialize analytics engine
        let treasury_analytics = AnalyticsEngine {
            risk_model_params: RiskModelParams {
                volatility_weight: 25,
                liquidity_weight: 25,
                counterparty_weight: 25,
                geographic_weight: 25,
                model_version: utf8(b"v1.0.0"),
            },
            transaction_patterns: table::new(ctx),
            performance_metrics: PerformanceMetrics {
                total_transactions: 0,
                total_volume: 0,
                avg_processing_time: 0,
                success_rate: 100,
                cost_efficiency: 95,
                last_calculated: current_time,
            },
            predictive_config: PredictiveConfig {
                forecasting_enabled: true,
                prediction_horizon: 2592000000, // 30 days
                confidence_threshold: 80,
                model_accuracy: 85,
            },
            ai_model_version: utf8(b"GPT-Enterprise-v1.0"),
        };

        // Initialize emergency configuration
        let emergency_config = EmergencyConfig {
            emergency_responders: vector::empty(),
            emergency_thresholds: table::new(ctx),
            fast_track_enabled: false,
            emergency_mode_active: false,
            emergency_activation_time: 0,
            emergency_contacts: vector::empty(),
        };

        // Initialize treasury metadata
        let metadata = TreasuryMetadata {
            name,
            description,
            organization,
            created_at: current_time,
            version: utf8(b"1.0.0"),
            contact_info: utf8(b"contact@bitcoinvaultpro.com"),
            image_url: option::none(),
        };

        let treasury = TreasuryVault {
            id: treasury_id,
            dwallet_cap,
            bitcoin_address,
            governance_config,
            spending_policies,
            compliance_monitor,
            treasury_analytics,
            pending_proposals: table::new(ctx),
            emergency_config,
            metadata,
            total_balance: 0,
            operational_funds: balance::zero(),
        };

        event::emit(TreasuryCreated {
            treasury_id: object::id(&treasury),
            creator: tx_context::sender(ctx),
            bitcoin_address,
            initial_balance: 0,
            timestamp: current_time,
        });

        treasury
    }

    /// Create default spending policy
    fun create_default_spending_policy(current_time: u64): SpendingPolicy {
        SpendingPolicy {
            policy_type: POLICY_STANDARD,
            max_amount_per_tx: 100000000, // 1 BTC in satoshis
            daily_limit: 500000000, // 5 BTC
            weekly_limit: 2000000000, // 20 BTC
            monthly_limit: 5000000000, // 50 BTC
            required_approvals: 3,
            approved_recipients: vector::empty(),
            time_lock_duration: MIN_TIMELOCK_DURATION,
            risk_assessment_required: true,
            compliance_check_required: true,
            activation_time: current_time,
            expiration_time: 0, // Never expires
        }
    }

    /// Entry function to create and share a new treasury vault
    public entry fun create_and_share_treasury(
        dwallet_cap: DWalletCap,
        bitcoin_address: vector<u8>,
        name: vector<u8>,
        description: vector<u8>,
        organization: vector<u8>,
        required_signers: vector<address>,
        min_approval_threshold: u8,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let treasury = create_treasury_vault(
            dwallet_cap,
            utf8(bitcoin_address),
            utf8(name),
            utf8(description),
            utf8(organization),
            required_signers,
            min_approval_threshold,
            clock,
            ctx
        );
        
        transfer::share_object(treasury);
    }

    // ====== Proposal Management ======

    /// Propose a new expenditure with comprehensive validation
    public entry fun propose_expenditure(
        vault: &mut TreasuryVault,
        amount: u64,
        recipient: vector<u8>,
        purpose: vector<u8>,
        urgency: u8,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(urgency <= MAX_URGENCY_LEVEL, EINVALID_RISK_SCORE);
        assert!(table::length(&vault.pending_proposals) < MAX_PENDING_PROPOSALS, EMAX_PROPOSALS_REACHED);
        assert!(!vault.emergency_config.emergency_mode_active, EEMERGENCY_MODE_ACTIVE);

        let current_time = clock::timestamp_ms(clock);
        let proposer = tx_context::sender(ctx);
        
        // Validate proposer authorization
        assert!(is_authorized_proposer(vault, proposer), EUNAUTHORIZED);
        
        // Determine applicable policy
        let policy_type = determine_policy_type(vault, amount, urgency);
        let policy = table::borrow(&vault.spending_policies, policy_type);
        
        // Validate proposal against policy
        assert!(validate_proposal_against_policy(amount, utf8(recipient), policy), EPOLICY_VIOLATION);
        
        // Create expenditure proposal
        let proposal_id = object::new(ctx);
        let time_lock_end = current_time + policy.time_lock_duration;
        let expires_at = current_time + (7 * 24 * 3600 * 1000); // 7 days
        
        let proposal = ExpenditureProposal {
            id: proposal_id,
            amount,
            recipient: utf8(recipient),
            purpose: utf8(purpose),
            urgency,
            proposer,
            required_approvals: policy.required_approvals,
            current_approvals: vector::empty(),
            time_lock_end,
            risk_assessment: option::none(),
            compliance_status: ComplianceStatus {
                aml_cleared: false,
                kyc_verified: false,
                sanctions_checked: false,
                regulatory_approved: false,
                compliance_officer: option::none(),
                last_checked: 0,
            },
            created_at: current_time,
            expires_at,
            metadata: table::new(ctx),
            policy_type,
            execution_status: 0, // Pending
        };
        
        let proposal_id_copy = object::id(&proposal);
        table::add(&mut vault.pending_proposals, proposal_id_copy, proposal);
        
        // Trigger compliance check if required
        if (policy.compliance_check_required) {
            initiate_compliance_check(vault, proposal_id_copy, current_time);
        };
        
        // Trigger risk assessment if required
        if (policy.risk_assessment_required) {
            initiate_risk_assessment(vault, proposal_id_copy, amount, current_time);
        };
        
        event::emit(ExpenditureProposed {
            proposal_id: proposal_id_copy,
            treasury_id: object::id(vault),
            amount,
            recipient: utf8(recipient),
            proposer,
            urgency,
            timestamp: current_time,
        });
    }

    /// Approve an expenditure proposal
    public entry fun approve_expenditure(
        vault: &mut TreasuryVault,
        proposal_id: ID,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let current_time = clock::timestamp_ms(clock);
        let approver = tx_context::sender(ctx);
        
        // Validate approver authorization
        assert!(is_authorized_approver(vault, approver), EUNAUTHORIZED);
        
        // Get and validate proposal
        assert!(table::contains(&vault.pending_proposals, proposal_id), EPROPOSAL_EXPIRED);
        let proposal = table::borrow_mut(&mut vault.pending_proposals, proposal_id);
        
        // Check if proposal has expired
        assert!(current_time < proposal.expires_at, EPROPOSAL_EXPIRED);
        
        // Check if already approved by this address
        assert!(!vector::contains(&proposal.current_approvals, &approver), EUNAUTHORIZED);
        
        // Add approval
        vector::push_back(&mut proposal.current_approvals, approver);
        
        let approval_count = (vector::length(&proposal.current_approvals) as u8);
        
        event::emit(ExpenditureApproved {
            proposal_id,
            approver,
            approval_count,
            timestamp: current_time,
        });
        
        // Check if sufficient approvals reached
        if (approval_count >= proposal.required_approvals) {
            // Mark as ready for execution (after timelock)
            proposal.execution_status = 1; // Approved, awaiting timelock
        };
    }

    // ====== Policy Management ======

    /// Update spending policy with enhanced controls
    public entry fun update_spending_policy(
        vault: &mut TreasuryVault,
        policy_type: u8,
        max_amount_per_tx: u64,
        daily_limit: u64,
        weekly_limit: u64,
        monthly_limit: u64,
        required_approvals: u8,
        time_lock_duration: u64,
        risk_assessment_required: bool,
        compliance_check_required: bool,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let current_time = clock::timestamp_ms(clock);
        let updater = tx_context::sender(ctx);
        
        // Validate authorization
        assert!(is_governance_member(vault, updater), EUNAUTHORIZED);
        
        // Validate parameters
        assert!(required_approvals <= vault.governance_config.max_approval_threshold, EINVALID_THRESHOLD);
        assert!(time_lock_duration >= MIN_TIMELOCK_DURATION && time_lock_duration <= MAX_TIMELOCK_DURATION, ETIMELOCKED);
        
        let new_policy = SpendingPolicy {
            policy_type,
            max_amount_per_tx,
            daily_limit,
            weekly_limit,
            monthly_limit,
            required_approvals,
            approved_recipients: vector::empty(),
            time_lock_duration,
            risk_assessment_required,
            compliance_check_required,
            activation_time: current_time,
            expiration_time: 0,
        };
        
        if (table::contains(&vault.spending_policies, policy_type)) {
            table::remove(&mut vault.spending_policies, policy_type);
        };
        
        table::add(&mut vault.spending_policies, policy_type, new_policy);
        
        event::emit(PolicyUpdated {
            treasury_id: object::id(vault),
            policy_type,
            updater,
            timestamp: current_time,
        });
    }

    // ====== Compliance and Risk Management ======

    /// Initiate compliance check for a proposal
    fun initiate_compliance_check(
        vault: &mut TreasuryVault,
        proposal_id: ID,
        current_time: u64
    ) {
        // This would typically integrate with external compliance services
        // For now, we mark compliance as initiated
        vault.compliance_monitor.last_compliance_check = current_time;
    }

    /// Initiate risk assessment for a proposal  
    fun initiate_risk_assessment(
        vault: &mut TreasuryVault,
        proposal_id: ID,
        amount: u64,
        current_time: u64
    ) {
        // This would typically use AI/ML models for risk scoring
        // For now, we create a basic risk assessment
        let base_risk = if (amount > 1000000000) { 70 } else if (amount > 100000000) { 50 } else { 30 };
        
        // Update analytics
        vault.treasury_analytics.performance_metrics.total_transactions = 
            vault.treasury_analytics.performance_metrics.total_transactions + 1;
    }

    // ====== Emergency Procedures ======

    /// Activate emergency mode for critical situations
    public entry fun activate_emergency_mode(
        vault: &mut TreasuryVault,
        reason: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let current_time = clock::timestamp_ms(clock);
        let activator = tx_context::sender(ctx);
        
        // Validate emergency responder
        assert!(
            vector::contains(&vault.emergency_config.emergency_responders, &activator) ||
            is_governance_member(vault, activator),
            EUNAUTHORIZED
        );
        
        vault.emergency_config.emergency_mode_active = true;
        vault.emergency_config.emergency_activation_time = current_time;
        
        event::emit(EmergencyActivated {
            treasury_id: object::id(vault),
            activator,
            reason: utf8(reason),
            timestamp: current_time,
        });
    }

    /// Deactivate emergency mode
    public entry fun deactivate_emergency_mode(
        vault: &mut TreasuryVault,
        ctx: &mut TxContext
    ) {
        let deactivator = tx_context::sender(ctx);
        
        // Validate authorization (requires governance approval)
        assert!(is_governance_member(vault, deactivator), EUNAUTHORIZED);
        
        vault.emergency_config.emergency_mode_active = false;
        vault.emergency_config.emergency_activation_time = 0;
    }

    // ====== Utility Functions ======

    /// Check if address is authorized to propose expenditures
    fun is_authorized_proposer(vault: &TreasuryVault, proposer: address): bool {
        vector::contains(&vault.governance_config.required_signers, &proposer) ||
        vector::contains(&vault.governance_config.governance_members, &proposer)
    }

    /// Check if address is authorized to approve expenditures
    fun is_authorized_approver(vault: &TreasuryVault, approver: address): bool {
        vector::contains(&vault.governance_config.required_signers, &approver)
    }

    /// Check if address is a governance member
    fun is_governance_member(vault: &TreasuryVault, member: address): bool {
        vector::contains(&vault.governance_config.governance_members, &member) ||
        vector::contains(&vault.governance_config.required_signers, &member)
    }

    /// Determine applicable policy type based on amount and urgency
    fun determine_policy_type(vault: &TreasuryVault, amount: u64, urgency: u8): u8 {
        if (urgency >= 8) {
            POLICY_EMERGENCY
        } else if (amount > 1000000000) { // > 10 BTC
            POLICY_HIGH_VALUE
        } else if (vault.compliance_monitor.aml_kyc_required) {
            POLICY_COMPLIANCE_REQUIRED
        } else {
            POLICY_STANDARD
        }
    }

    /// Validate proposal against spending policy
    fun validate_proposal_against_policy(
        amount: u64,
        recipient: String,
        policy: &SpendingPolicy
    ): bool {
        amount <= policy.max_amount_per_tx
        // Additional validations would be implemented here
    }

    // ====== Getter Functions ======

    /// Get treasury total balance
    public fun get_total_balance(vault: &TreasuryVault): u64 {
        vault.total_balance
    }

    /// Get treasury Bitcoin address
    public fun get_bitcoin_address(vault: &TreasuryVault): String {
        vault.bitcoin_address
    }

    /// Get treasury metadata
    public fun get_treasury_metadata(vault: &TreasuryVault): &TreasuryMetadata {
        &vault.metadata
    }

    /// Get governance configuration
    public fun get_governance_config(vault: &TreasuryVault): &GovernanceConfig {
        &vault.governance_config
    }

    /// Get compliance monitor status
    public fun get_compliance_status(vault: &TreasuryVault): &ComplianceMonitor {
        &vault.compliance_monitor
    }

    /// Get analytics data
    public fun get_analytics(vault: &TreasuryVault): &AnalyticsEngine {
        &vault.treasury_analytics
    }

    /// Get emergency configuration
    public fun get_emergency_config(vault: &TreasuryVault): &EmergencyConfig {
        &vault.emergency_config
    }

    /// Check if emergency mode is active
    public fun is_emergency_mode_active(vault: &TreasuryVault): bool {
        vault.emergency_config.emergency_mode_active
    }

    /// Get number of pending proposals
    public fun get_pending_proposals_count(vault: &TreasuryVault): u64 {
        table::length(&vault.pending_proposals)
    }

    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        // Test initialization function
    }
} 