/**
 * Email Templates Slice
 * Redux slice for managing email templates
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { EmailTemplate } from '../../types/emailTemplate.types';

interface EmailTemplatesState {
  templates: EmailTemplate[];
}

const initialState: EmailTemplatesState = {
  templates: [
    {
      id: 'template-001',
      name: 'Initial Contact - Japan Market',
      category: 'INITIAL_CONTACT',
      subject: 'Introduction from HekaBio - Partnership Opportunity',
      body: `Dear {{contact_first_name}},

I hope this message finds you well. My name is {{user_name}}, and I am {{user_title}} at HekaBio.

I am reaching out because we are exploring partnership opportunities in the {{company_industry}} sector in Japan, and {{company_name}} stood out as a potential collaborator given your expertise and market position.

At HekaBio, we specialize in bridging innovative life sciences companies with the Japanese market. We would be interested in discussing how we might work together to achieve mutual growth objectives.

Would you be available for a brief introductory call in the coming weeks? I would be happy to work around your schedule.

Looking forward to hearing from you.

Best regards,
{{user_name}}
{{user_title}}
{{user_email}}
{{user_phone}}`,
      description: 'Initial outreach template for Japanese market partnerships',
      variables: [
        'contact_first_name',
        'user_name',
        'user_title',
        'company_industry',
        'company_name',
        'user_email',
        'user_phone',
      ],
      isActive: true,
      createdBy: 'user-001',
      createdAt: '2026-01-01T09:00:00Z',
      updatedAt: '2026-01-01T09:00:00Z',
    },
    {
      id: 'template-002',
      name: 'Follow-up After Meeting',
      category: 'FOLLOW_UP',
      subject: 'Thank you for meeting - Next Steps',
      body: `Dear {{contact_first_name}},

Thank you for taking the time to meet with me earlier. I truly appreciated the opportunity to learn more about {{company_name}} and your goals in the {{company_industry}} sector.

As discussed, I will follow up with the additional information regarding our partnership framework by the end of this week.

In the meantime, please don't hesitate to reach out if you have any questions or need clarification on any points we covered.

I look forward to our continued conversation.

Best regards,
{{user_name}}
{{user_title}}
{{user_email}}`,
      description: 'Follow-up template after initial meeting',
      variables: [
        'contact_first_name',
        'company_name',
        'company_industry',
        'user_name',
        'user_title',
        'user_email',
      ],
      isActive: true,
      createdBy: 'user-001',
      createdAt: '2026-01-02T10:00:00Z',
      updatedAt: '2026-01-02T10:00:00Z',
    },
    {
      id: 'template-003',
      name: 'Proposal Submission',
      category: 'PROPOSAL',
      subject: 'Partnership Proposal - {{company_name}} & HekaBio',
      body: `Dear {{contact_full_name}},

I am pleased to submit our formal partnership proposal for {{company_name}}.

After our recent discussions, we have prepared a comprehensive proposal that outlines:

• Partnership framework and objectives
• Market entry strategy for Japan
• Timeline and milestones
• Investment and resource requirements

The attached proposal document provides detailed information on each of these areas. We believe this partnership has significant potential for both organizations.

I would welcome the opportunity to present this proposal in person and address any questions you may have.

Please let me know your availability for a discussion at your earliest convenience.

Best regards,
{{user_name}}
{{user_title}}
HekaBio
{{user_email}}
{{user_phone}}`,
      description: 'Template for submitting formal partnership proposals',
      variables: [
        'contact_full_name',
        'company_name',
        'user_name',
        'user_title',
        'user_email',
        'user_phone',
      ],
      isActive: true,
      createdBy: 'user-001',
      createdAt: '2026-01-03T11:00:00Z',
      updatedAt: '2026-01-03T11:00:00Z',
    },
  ],
};

const emailTemplatesSlice = createSlice({
  name: 'emailTemplates',
  initialState,
  reducers: {
    addTemplate: (state, action: PayloadAction<EmailTemplate>) => {
      state.templates.push(action.payload);
    },
    updateTemplate: (state, action: PayloadAction<EmailTemplate>) => {
      const index = state.templates.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.templates[index] = action.payload;
      }
    },
    deleteTemplate: (state, action: PayloadAction<string>) => {
      state.templates = state.templates.filter((t) => t.id !== action.payload);
    },
    toggleTemplateActive: (state, action: PayloadAction<string>) => {
      const template = state.templates.find((t) => t.id === action.payload);
      if (template) {
        template.isActive = !template.isActive;
        template.updatedAt = new Date().toISOString();
      }
    },
  },
});

export const {
  addTemplate,
  updateTemplate,
  deleteTemplate,
  toggleTemplateActive,
} = emailTemplatesSlice.actions;

export default emailTemplatesSlice.reducer;
