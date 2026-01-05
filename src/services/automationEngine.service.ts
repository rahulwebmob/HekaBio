/**
 * Automation Engine Service
 * Executes automation rules based on triggers and conditions
 */

import type {
  AutomationRule,
  AutomationTriggerType,
  AutomationCondition,
  AutomationAction,
  AutomationExecutionLog,
  ExecutionStatus,
} from '../types/automation.types';
import type { Project } from '../types/project.types';
import type { SurveyInstance } from '../types/survey.types';
import type { Opportunity } from '../types/opportunity.types';

// ===== Automation Engine =====
export class AutomationEngine {
  private static instance: AutomationEngine;

  private constructor() {}

  static getInstance(): AutomationEngine {
    if (!AutomationEngine.instance) {
      AutomationEngine.instance = new AutomationEngine();
    }
    return AutomationEngine.instance;
  }

  /**
   * Main entry point: Execute all active rules for a given trigger
   */
  async executeTrigger(
    triggerType: AutomationTriggerType,
    triggerData: Record<string, any>,
    rules: AutomationRule[]
  ): Promise<AutomationExecutionLog[]> {
    const logs: AutomationExecutionLog[] = [];

    // Filter rules by trigger type and active status
    const matchingRules = rules.filter(
      (rule) => rule.isActive && rule.trigger.type === triggerType
    );

    console.log(
      `[AutomationEngine] Found ${matchingRules.length} active rules for trigger: ${triggerType}`
    );

    for (const rule of matchingRules) {
      const log = await this.executeRule(rule, triggerType, triggerData);
      logs.push(log);
    }

    return logs;
  }

  /**
   * Execute a single automation rule
   */
  private async executeRule(
    rule: AutomationRule,
    triggerType: AutomationTriggerType,
    triggerData: Record<string, any>
  ): Promise<AutomationExecutionLog> {
    const startedAt = new Date().toISOString();
    const log: AutomationExecutionLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ruleId: rule.id,
      ruleName: rule.name,
      triggeredBy: triggerType,
      triggerData,
      status: 'RUNNING',
      startedAt,
      conditionsMet: false,
      conditionsEvaluated: [],
      actionsExecuted: [],
      retryCount: 0,
    };

    try {
      // Step 1: Evaluate conditions
      const conditionsResult = this.evaluateConditions(rule.conditions, triggerData);
      log.conditionsEvaluated = conditionsResult.evaluations;
      log.conditionsMet = conditionsResult.allMet;

      // Step 2: Execute actions if conditions are met
      if (log.conditionsMet || rule.conditions.length === 0) {
        console.log(`[AutomationEngine] Conditions met for rule: ${rule.name}`);

        // Execute actions in order
        for (const action of rule.actions.sort((a, b) => a.order - b.order)) {
          const actionResult = await this.executeAction(action, triggerData);
          log.actionsExecuted.push(actionResult);

          if (actionResult.status === 'FAILED' && !rule.retryOnFailure) {
            console.error(`[AutomationEngine] Action failed, stopping execution: ${action.type}`);
            break;
          }
        }

        log.status = log.actionsExecuted.every((a) => a.status === 'SUCCESS')
          ? 'SUCCESS'
          : 'FAILED';
      } else {
        console.log(`[AutomationEngine] Conditions not met for rule: ${rule.name}`);
        log.status = 'SKIPPED';
      }
    } catch (error) {
      log.status = 'FAILED';
      log.error = error instanceof Error ? error.message : 'Unknown error';
      log.errorStack = error instanceof Error ? error.stack : undefined;
      console.error(`[AutomationEngine] Rule execution failed: ${rule.name}`, error);
    }

    const completedAt = new Date().toISOString();
    log.completedAt = completedAt;
    log.duration = new Date(completedAt).getTime() - new Date(startedAt).getTime();

    return log;
  }

  /**
   * Evaluate all conditions
   */
  private evaluateConditions(
    conditions: AutomationCondition[],
    data: Record<string, any>
  ): {
    allMet: boolean;
    evaluations: { condition: AutomationCondition; result: boolean; actualValue?: any }[];
  } {
    const evaluations: { condition: AutomationCondition; result: boolean; actualValue?: any }[] =
      [];

    for (const condition of conditions) {
      const actualValue = this.getNestedValue(data, condition.field);
      const result = this.evaluateCondition(condition, actualValue);

      evaluations.push({
        condition,
        result,
        actualValue,
      });

      // If using AND logic and condition fails, we can short-circuit
      if (!result && condition.logicalOperator !== 'OR') {
        return { allMet: false, evaluations };
      }
    }

    // All conditions passed (or no conditions)
    return { allMet: true, evaluations };
  }

  /**
   * Evaluate a single condition
   */
  private evaluateCondition(condition: AutomationCondition, actualValue: any): boolean {
    const { operator, value } = condition;

    switch (operator) {
      case 'EQUALS':
        return actualValue === value;
      case 'NOT_EQUALS':
        return actualValue !== value;
      case 'CONTAINS':
        return String(actualValue).includes(String(value));
      case 'NOT_CONTAINS':
        return !String(actualValue).includes(String(value));
      case 'GREATER_THAN':
        return Number(actualValue) > Number(value);
      case 'LESS_THAN':
        return Number(actualValue) < Number(value);
      case 'IN':
        return Array.isArray(value) && value.includes(actualValue);
      case 'NOT_IN':
        return Array.isArray(value) && !value.includes(actualValue);
      case 'IS_EMPTY':
        return actualValue == null || actualValue === '' || (Array.isArray(actualValue) && actualValue.length === 0);
      case 'IS_NOT_EMPTY':
        return actualValue != null && actualValue !== '' && (!Array.isArray(actualValue) || actualValue.length > 0);
      default:
        console.warn(`[AutomationEngine] Unknown operator: ${operator}`);
        return false;
    }
  }

  /**
   * Execute a single action
   */
  private async executeAction(
    action: AutomationAction,
    triggerData: Record<string, any>
  ): Promise<{ action: AutomationAction; status: ExecutionStatus; result?: any; error?: string }> {
    console.log(`[AutomationEngine] Executing action: ${action.type}`);

    try {
      // Replace template variables in config
      const config = this.replaceTemplateVariables(action.config, triggerData);

      let result: any;

      switch (action.type) {
        case 'CREATE_TASK':
          result = await this.actionCreateTask(config);
          break;

        case 'SEND_EMAIL':
          result = await this.actionSendEmail(config);
          break;

        case 'SEND_NOTIFICATION':
          result = await this.actionSendNotification(config);
          break;

        case 'UPDATE_PROJECT_STAGE':
          result = await this.actionUpdateProjectStage(config, triggerData);
          break;

        case 'UPDATE_PROJECT_FIELD':
          result = await this.actionUpdateProjectField(config, triggerData);
          break;

        case 'ASSIGN_USER':
          result = await this.actionAssignUser(config, triggerData);
          break;

        case 'ADD_TAG':
          result = await this.actionAddTag(config, triggerData);
          break;

        case 'WAIT':
          result = await this.actionWait(config);
          break;

        default:
          console.warn(`[AutomationEngine] Action type not implemented: ${action.type}`);
          result = { message: 'Action type not implemented', implemented: false };
      }

      return {
        action,
        status: 'SUCCESS',
        result,
      };
    } catch (error) {
      return {
        action,
        status: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // ===== Action Implementations =====

  private async actionCreateTask(config: any): Promise<any> {
    console.log('[AutomationEngine] Creating task:', config);

    // In a real implementation, this would dispatch to Redux or call an API
    const task = {
      id: `task-${Date.now()}`,
      title: config.taskTitle,
      description: config.taskDescription,
      priority: config.taskPriority || 'MEDIUM',
      assignee: config.taskAssignee,
      dueDate: config.taskDueInDays
        ? new Date(Date.now() + config.taskDueInDays * 24 * 60 * 60 * 1000).toISOString()
        : undefined,
      status: 'TODO',
      createdAt: new Date().toISOString(),
    };

    return { taskCreated: true, task };
  }

  private async actionSendEmail(config: any): Promise<any> {
    console.log('[AutomationEngine] Sending email:', config);

    // In a real implementation, this would call an email service
    const email = {
      to: config.emailTo,
      cc: config.emailCc,
      subject: config.emailSubject,
      body: config.emailBody,
      sentAt: new Date().toISOString(),
    };

    return { emailSent: true, email };
  }

  private async actionSendNotification(config: any): Promise<any> {
    console.log('[AutomationEngine] Sending notification:', config);

    // In a real implementation, this would dispatch to Redux notifications
    const notification = {
      id: `notif-${Date.now()}`,
      to: config.notificationTo,
      title: config.notificationTitle,
      message: config.notificationMessage,
      link: config.notificationLink,
      createdAt: new Date().toISOString(),
      read: false,
    };

    return { notificationSent: true, notification };
  }

  private async actionUpdateProjectStage(config: any, _triggerData: any): Promise<any> {
    console.log('[AutomationEngine] Updating project stage:', config);

    const projectId = _triggerData.project?.id;
    if (!projectId) {
      throw new Error('Project ID not found in trigger data');
    }

    // In a real implementation, this would dispatch to Redux
    return {
      projectUpdated: true,
      projectId,
      newStage: config.newStage,
    };
  }

  private async actionUpdateProjectField(config: any, _triggerData: any): Promise<any> {
    console.log('[AutomationEngine] Updating project field:', config);

    const projectId = _triggerData.project?.id;
    if (!projectId) {
      throw new Error('Project ID not found in trigger data');
    }

    return {
      projectUpdated: true,
      projectId,
      field: config.fieldName,
      value: config.fieldValue,
    };
  }

  private async actionAssignUser(config: any, _triggerData: any): Promise<any> {
    console.log('[AutomationEngine] Assigning user:', config);

    return {
      userAssigned: true,
      userId: config.userId,
      assignmentType: config.assignmentType,
    };
  }

  private async actionAddTag(config: any, _triggerData: any): Promise<any> {
    console.log('[AutomationEngine] Adding tag:', config);

    const projectId = _triggerData.project?.id;
    if (!projectId) {
      throw new Error('Project ID not found in trigger data');
    }

    return {
      tagAdded: true,
      projectId,
      tag: config.tag,
    };
  }

  private async actionWait(config: any): Promise<any> {
    console.log('[AutomationEngine] Waiting:', config);

    const waitMs = (config.waitDays || 0) * 24 * 60 * 60 * 1000;

    // In a real implementation, this would schedule the next action
    return {
      waitScheduled: true,
      waitUntil: new Date(Date.now() + waitMs).toISOString(),
    };
  }

  // ===== Helper Methods =====

  /**
   * Get nested value from object using dot notation
   * e.g., "project.company.name"
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Replace template variables like {{project.name}} with actual values
   */
  private replaceTemplateVariables(config: any, data: Record<string, any>): any {
    if (typeof config === 'string') {
      return config.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
        const value = this.getNestedValue(data, path.trim());
        return value !== undefined ? String(value) : match;
      });
    }

    if (Array.isArray(config)) {
      return config.map((item) => this.replaceTemplateVariables(item, data));
    }

    if (config && typeof config === 'object') {
      const result: any = {};
      for (const key in config) {
        result[key] = this.replaceTemplateVariables(config[key], data);
      }
      return result;
    }

    return config;
  }
}

// Export singleton instance
export const automationEngine = AutomationEngine.getInstance();

// ===== Trigger Helper Functions =====

/**
 * Trigger automation when survey is submitted
 */
export async function triggerSurveySubmitted(
  survey: SurveyInstance,
  rules: AutomationRule[]
): Promise<AutomationExecutionLog[]> {
  const triggerData = {
    survey: {
      id: survey.id,
      name: survey.template.name,
      status: survey.status,
      completionPercentage: survey.completionPercentage,
    },
    company: survey.company,
    project: survey.project,
  };

  return automationEngine.executeTrigger('SURVEY_SUBMITTED', triggerData, rules);
}

/**
 * Trigger automation when project stage changes
 */
export async function triggerProjectStageChanged(
  project: Project,
  oldStage: string,
  newStage: string,
  rules: AutomationRule[]
): Promise<AutomationExecutionLog[]> {
  const triggerData = {
    project,
    oldStage,
    newStage,
  };

  return automationEngine.executeTrigger('PROJECT_STAGE_CHANGED', triggerData, rules);
}

/**
 * Trigger automation when opportunity decision is made
 */
export async function triggerOpportunityDecisionMade(
  opportunity: Opportunity,
  rules: AutomationRule[]
): Promise<AutomationExecutionLog[]> {
  const triggerData = {
    opportunity,
    company: opportunity.company,
    decision: opportunity.goNoGoDecision?.decision,
  };

  return automationEngine.executeTrigger('OPPORTUNITY_DECISION_MADE', triggerData, rules);
}

/**
 * Trigger automation when project is created
 */
export async function triggerProjectCreated(
  project: Project,
  rules: AutomationRule[]
): Promise<AutomationExecutionLog[]> {
  const triggerData = {
    project,
    company: project.company,
  };

  return automationEngine.executeTrigger('PROJECT_CREATED', triggerData, rules);
}

/**
 * Trigger automation when project score changes
 */
export async function triggerProjectScoreChanged(
  project: Project,
  oldScore: number,
  newScore: number,
  rules: AutomationRule[]
): Promise<AutomationExecutionLog[]> {
  const triggerData = {
    project,
    oldScore,
    newScore,
  };

  return automationEngine.executeTrigger('PROJECT_SCORE_CHANGED', triggerData, rules);
}
