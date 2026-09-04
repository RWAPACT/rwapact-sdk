# Security Policy

The RWAPACT team takes the security of our smart contracts, middleware risk gate, and software development kits very seriously. We appreciate the responsible disclosure of vulnerabilities by the security community.

## Supported Versions

We actively maintain and provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0.0 | :x:                |

---

## Reporting a Vulnerability

If you discover a security vulnerability within the RWAPACT SDK, the on-chain smart contracts (`PactGate`, `KPV_PolicyVault`, `KSO_SessionOracle`, `KAR_AttestationRegistry`, `KRO_RiskOracle`, `KGR_GasRouter`), or the underlying validation algorithms:

> **IMPORTANT**: **DO NOT** disclose security vulnerabilities through public GitHub issues, discussions, or social media channels.

### Contact Channels

Please report any suspected vulnerabilities privately through one of the following methods:

1. **GitHub Security Advisory**: Submit a private report via the [GitHub Security Advisory](https://github.com/RWAPACT/rwapact-sdk/security/advisories/new) dashboard.
2. **Security Email**: Send an encrypted report to **`security@rwapact.app`**.

### What to Include in Your Report

To help us investigate and triage the issue quickly, please provide:
- A clear description of the vulnerability and its potential impact.
- Step-by-step instructions or proof-of-concept (PoC) code to reproduce the issue.
- Specific contract addresses, function signatures, or SDK methods affected.
- Your assessment of the severity (Critical, High, Medium, Low).
- Any proposed mitigations or remediation strategies.

---

## Response Timeline & SLA

We commit to the following response timeline for all acknowledged security reports:

- **Initial Acknowledgment**: Within **24 hours** of receiving the report.
- **Triage & Assessment**: Within **48-72 hours**, confirming severity and scope.
- **Patch Development & Testing**: Dependent on complexity; critical issues prioritized for emergency hotfix within **5 business days**.
- **Coordinated Disclosure**: We coordinate public disclosure with the reporter once fixes have been safely deployed and verified on-chain.

---

## Bug Bounty Program

High-impact reports affecting protocol funds, unauthorized session bypasses, or smart contract access control violations may qualify for a reward under our upcoming community bug bounty program.

Rewards are evaluated based on the [CVSS v3.1](https://www.first.org/cvss/) standard and impact on user funds.

---

## Safe Harbor

We consider security research conducted in good faith under this policy to be authorized. We will not pursue legal action against researchers who:
- Make a good-faith effort to avoid privacy violations, destruction of data, and interruption or degradation of services.
- Give us reasonable time to remedy the vulnerability before making any public disclosure.
- Do not exploit a security issue for unauthorized gain or fund extraction.
