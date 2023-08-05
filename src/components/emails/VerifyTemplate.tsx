import * as React from 'react';

interface EmailTemplateProps {
    firstName: string;
    verificationLink: string;
}

export const Verify: React.FC<Readonly<EmailTemplateProps>> = ({ firstName, verificationLink }) => (
    <div>
        <h1>Welcome, {firstName}!</h1>
        <p>
            Verify your email by clicking this link: <span>${verificationLink}</span> or paste it into your browser window.
        </p>
    </div>
);
