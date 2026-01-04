/**
 * Task Assignment Service
 * Automatically assigns tasks to users based on role and context
 */

import type { TaskType } from '../types/task.types';
import type { UserRole } from '../types/auth.types';

// Role mapping for task types
const TASK_TYPE_TO_ROLE_MAP: Record<TaskType, UserRole[]> = {
  REVIEW: ['gate_1_analyst', 'gate_2_analyst', 'crm_owner'],
  RESEARCH: ['dd_specialist_scientific', 'dd_specialist_regulatory', 'gate_1_analyst'],
  MEETING: ['crm_owner', 'gate_3_decision_maker'],
  CALL: ['crm_owner', 'gate_1_analyst'],
  FOLLOW_UP: ['crm_owner', 'gate_2_analyst'],
  GENERAL: ['crm_owner', 'gate_1_analyst'],
};

// Role priority (higher number = higher priority for assignment)
const ROLE_PRIORITY: Record<UserRole, number> = {
  super_admin: 10,
  crm_owner: 8,
  gate_1_analyst: 7,
  gate_2_analyst: 7,
  gate_3_decision_maker: 6,
  dd_specialist_scientific: 7,
  dd_specialist_regulatory: 7,
  dd_specialist_commercial: 7,
  dd_specialist_financial: 7,
  product_owner: 5,
  hospital_staff: 3,
  distributor_staff: 3,
  license_holder_staff: 3,
  manufacturing_staff: 3,
};

export interface UserAssignment {
  userId: string;
  userName: string;
  userRole: UserRole;
  userEmail?: string;
}

export interface AssignmentContext {
  taskType: TaskType;
  projectId?: string;
  companyId?: string;
  gateNumber?: number;
  ddSectionType?: string;
  preferredRole?: UserRole;
  excludeUsers?: string[];
}

/**
 * Mock user database - In real app, this would come from API/database
 */
const MOCK_USERS: UserAssignment[] = [
  {
    userId: 'user-001',
    userName: 'Sarah Chen',
    userRole: 'crm_owner',
    userEmail: 'sarah.chen@hekabio.com',
  },
  {
    userId: 'user-002',
    userName: 'David Kim',
    userRole: 'gate_1_analyst',
    userEmail: 'david.kim@hekabio.com',
  },
  {
    userId: 'user-003',
    userName: 'Emily Rodriguez',
    userRole: 'dd_specialist_scientific',
    userEmail: 'emily.rodriguez@hekabio.com',
  },
  {
    userId: 'user-004',
    userName: 'Michael Park',
    userRole: 'gate_2_analyst',
    userEmail: 'michael.park@hekabio.com',
  },
  {
    userId: 'user-005',
    userName: 'Jennifer Liu',
    userRole: 'gate_3_decision_maker',
    userEmail: 'jennifer.liu@hekabio.com',
  },
  {
    userId: 'user-006',
    userName: 'Robert Zhang',
    userRole: 'dd_specialist_regulatory',
    userEmail: 'robert.zhang@hekabio.com',
  },
  {
    userId: 'user-007',
    userName: 'Lisa Wang',
    userRole: 'dd_specialist_commercial',
    userEmail: 'lisa.wang@hekabio.com',
  },
];

/**
 * Get users by role
 */
export function getUsersByRole(role: UserRole): UserAssignment[] {
  return MOCK_USERS.filter((user) => user.userRole === role);
}

/**
 * Get user by ID
 */
export function getUserById(userId: string): UserAssignment | undefined {
  return MOCK_USERS.find((user) => user.userId === userId);
}

/**
 * Get all users
 */
export function getAllUsers(): UserAssignment[] {
  return [...MOCK_USERS];
}

/**
 * Auto-assign task to appropriate user based on context
 */
export function autoAssignTask(context: AssignmentContext): UserAssignment {
  const { taskType, preferredRole, excludeUsers = [] } = context;

  // If preferred role is specified, try to assign to that role first
  if (preferredRole) {
    const usersWithRole = getUsersByRole(preferredRole).filter(
      (user) => !excludeUsers.includes(user.userId)
    );
    if (usersWithRole.length > 0) {
      // Round-robin or random assignment within role
      return usersWithRole[Math.floor(Math.random() * usersWithRole.length)];
    }
  }

  // Get eligible roles for this task type
  const eligibleRoles = TASK_TYPE_TO_ROLE_MAP[taskType] || ['crm_user'];

  // Sort roles by priority
  const sortedRoles = eligibleRoles.sort((a, b) => ROLE_PRIORITY[b] - ROLE_PRIORITY[a]);

  // Try to find available user from highest priority role
  for (const role of sortedRoles) {
    const usersWithRole = getUsersByRole(role).filter(
      (user) => !excludeUsers.includes(user.userId)
    );
    if (usersWithRole.length > 0) {
      // Round-robin or random assignment within role
      return usersWithRole[Math.floor(Math.random() * usersWithRole.length)];
    }
  }

  // Fallback: assign to first CRM user not in exclude list
  const fallbackUser = MOCK_USERS.filter((user) => !excludeUsers.includes(user.userId))[0];

  return fallbackUser || MOCK_USERS[0];
}

/**
 * Get recommended assignees for a task
 */
export function getRecommendedAssignees(context: AssignmentContext): UserAssignment[] {
  const { taskType, preferredRole, excludeUsers = [] } = context;

  let recommendedUsers: UserAssignment[] = [];

  // If preferred role is specified, prioritize that role
  if (preferredRole) {
    recommendedUsers = getUsersByRole(preferredRole);
  } else {
    // Get users from eligible roles
    const eligibleRoles = TASK_TYPE_TO_ROLE_MAP[taskType] || ['crm_user'];
    const sortedRoles = eligibleRoles.sort((a, b) => ROLE_PRIORITY[b] - ROLE_PRIORITY[a]);

    // Collect users from all eligible roles
    sortedRoles.forEach((role) => {
      const usersWithRole = getUsersByRole(role);
      recommendedUsers.push(...usersWithRole);
    });
  }

  // Filter out excluded users
  recommendedUsers = recommendedUsers.filter((user) => !excludeUsers.includes(user.userId));

  // Remove duplicates
  const uniqueUsers = Array.from(
    new Map(recommendedUsers.map((user) => [user.userId, user])).values()
  );

  // Sort by role priority
  uniqueUsers.sort((a, b) => ROLE_PRIORITY[b.userRole] - ROLE_PRIORITY[a.userRole]);

  return uniqueUsers;
}

/**
 * Assign task to specific gate reviewer based on gate number
 */
export function assignGateReviewer(gateNumber: number): UserAssignment {
  // Assign based on gate number
  let gateReviewers: UserAssignment[];

  if (gateNumber === 1) {
    gateReviewers = getUsersByRole('gate_1_analyst');
  } else if (gateNumber === 2) {
    gateReviewers = getUsersByRole('gate_2_analyst');
  } else {
    gateReviewers = getUsersByRole('gate_3_decision_maker');
  }

  if (gateReviewers.length === 0) {
    // Fallback to CRM owner
    return getUsersByRole('crm_owner')[0] || MOCK_USERS[0];
  }

  // Round-robin assignment based on gate number
  const index = (gateNumber - 1) % gateReviewers.length;
  return gateReviewers[index];
}

/**
 * Assign task to DD specialist based on section type
 */
export function assignDDSpecialist(
  sectionType?: 'scientific' | 'regulatory' | 'commercial' | 'financial'
): UserAssignment {
  // Assign based on section type
  let role: UserRole;

  switch (sectionType) {
    case 'scientific':
      role = 'dd_specialist_scientific';
      break;
    case 'regulatory':
      role = 'dd_specialist_regulatory';
      break;
    case 'commercial':
      role = 'dd_specialist_commercial';
      break;
    case 'financial':
      role = 'dd_specialist_financial';
      break;
    default: {
      // Random DD specialist type
      const roles: UserRole[] = [
        'dd_specialist_scientific',
        'dd_specialist_regulatory',
        'dd_specialist_commercial',
        'dd_specialist_financial',
      ];
      role = roles[Math.floor(Math.random() * roles.length)];
    }
  }

  const ddSpecialists = getUsersByRole(role);

  if (ddSpecialists.length === 0) {
    // Fallback to gate 1 analyst
    return getUsersByRole('gate_1_analyst')[0] || MOCK_USERS[0];
  }

  // Round-robin or random assignment within role
  return ddSpecialists[Math.floor(Math.random() * ddSpecialists.length)];
}

/**
 * Get workload for a user (number of active tasks)
 * In real app, this would query actual task counts
 */
export function getUserWorkload(userId: string): number {
  // Mock workload - in real app, query from database
  const mockWorkloads: Record<string, number> = {
    'user-001': 12,
    'user-002': 8,
    'user-003': 15,
    'user-004': 6,
    'user-005': 9,
    'user-006': 11,
    'user-007': 7,
  };

  return mockWorkloads[userId] || 0;
}

/**
 * Auto-assign with load balancing
 */
export function autoAssignWithLoadBalancing(context: AssignmentContext): UserAssignment {
  const recommendedUsers = getRecommendedAssignees(context);

  if (recommendedUsers.length === 0) {
    return MOCK_USERS[0];
  }

  // Sort by workload (ascending)
  const usersByWorkload = recommendedUsers
    .map((user) => ({
      ...user,
      workload: getUserWorkload(user.userId),
    }))
    .sort((a, b) => a.workload - b.workload);

  // Return user with lowest workload
  return usersByWorkload[0];
}
