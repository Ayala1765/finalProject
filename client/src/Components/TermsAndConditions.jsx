import React from 'react';

const TermsAndConditions = () => {
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', lineHeight: '1.6', color: '#333' }}>
            <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>Terms and Conditions</h1>
            <p style={{ fontSize: '16px', marginBottom: '20px' }}>
                Welcome to our platform. By using our services, you agree to the following terms and conditions:
            </p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '40px', fontSize: '16px' }}>
                <li>You must provide accurate and truthful information during registration.</li>
                <li>Donations are non-refundable once processed.</li>
                <li>We reserve the right to modify these terms at any time.</li>
                <li>Use of this platform must comply with all applicable laws and regulations.</li>
            </ul>
    
        </div>
    );
};

export default TermsAndConditions;