-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "parentId" TEXT,
    "level" INTEGER NOT NULL DEFAULT 1,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Organization_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Organization" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "realName" TEXT NOT NULL,
    "employeeNo" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "gender" TEXT,
    "orgId" TEXT,
    "roleId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isExternal" BOOLEAN NOT NULL DEFAULT false,
    "contractorId" TEXT,
    "signature" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "Contractor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "permissions" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Authorization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "scope" TEXT NOT NULL DEFAULT 'general',
    "module" TEXT NOT NULL,
    "permission" TEXT NOT NULL DEFAULT 'read',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Authorization_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Authorization_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SystemParameter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "module" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SafetyPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "fileUrl" TEXT,
    "fileSize" INTEGER,
    "uploadBy" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AnnualObjective" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "level" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "indicators" TEXT,
    "achievement" REAL,
    "responsibleUser" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "parentId" TEXT,
    "fileUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ObjectiveResponsibilityAgreement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "objectiveId" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "templateFileUrl" TEXT,
    "signedFileUrl" TEXT,
    "signStatus" TEXT NOT NULL DEFAULT 'pending',
    "approverId" TEXT,
    "approveTime" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AnnualPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "fileUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "publishTime" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PlanFeedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "planId" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "feedbackBy" TEXT NOT NULL,
    "actions" TEXT,
    "measures" TEXT,
    "implementation" TEXT,
    "fileUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "feedbackTime" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SafetyCommittee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "fileUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SafetyCommitteeMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "committeeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "duty" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SafetyMeeting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "committeeId" TEXT,
    "title" TEXT NOT NULL,
    "meetingDate" DATETIME NOT NULL,
    "content" TEXT,
    "minutesFileUrl" TEXT,
    "attendees" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SafetyManagementOrg" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" TEXT,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SafetyManagementOrg_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "SafetyManagementOrg" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ResponsibilitySystem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "fileUrl" TEXT,
    "publishBy" TEXT NOT NULL,
    "publishTime" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "reviewStatus" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ResponsibilityFeedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "systemId" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "confirmStatus" TEXT NOT NULL DEFAULT 'pending',
    "fulfillMaterial" TEXT,
    "confirmTime" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SafetyExpenditurePlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "totalAmount" REAL NOT NULL,
    "categories" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "approverId" TEXT,
    "approveTime" DATETIME,
    "fileUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SafetyExpenditureRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "planId" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "balance" REAL,
    "description" TEXT,
    "fileUrl" TEXT,
    "recordBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LegalRegulation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "source" TEXT,
    "regulationNo" TEXT,
    "effectiveDate" DATETIME,
    "expireDate" DATETIME,
    "isApplicable" BOOLEAN NOT NULL DEFAULT false,
    "applicableScope" TEXT,
    "content" TEXT,
    "fileUrl" TEXT,
    "publishTime" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "InternalRegulation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT,
    "title" TEXT NOT NULL,
    "regulationNo" TEXT,
    "category" TEXT,
    "content" TEXT,
    "fileUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "version" INTEGER NOT NULL DEFAULT 1,
    "publishTime" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ComplianceAssessment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "fileUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SafetyCertificate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "certType" TEXT NOT NULL,
    "certCategory" TEXT,
    "certItem" TEXT,
    "certNo" TEXT,
    "issueOrg" TEXT,
    "issueDate" DATETIME,
    "expireDate" DATETIME,
    "reviewDate" DATETIME,
    "fileUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'valid',
    "alertLevel" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CertificateStandard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "certType" TEXT NOT NULL,
    "certCategory" TEXT NOT NULL,
    "certItem" TEXT,
    "requiredCount" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SafetyCourse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "courseType" TEXT NOT NULL DEFAULT 'online',
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "studyHours" REAL,
    "videoUrl" TEXT,
    "examId" TEXT,
    "examQuestionCount" INTEGER,
    "examPassScore" REAL,
    "startLearnTime" DATETIME,
    "endLearnTime" DATETIME,
    "fileUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "publishBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "UserCourse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'not_started',
    "studyHours" REAL NOT NULL DEFAULT 0,
    "startTime" DATETIME,
    "endTime" DATETIME,
    "examScore" REAL,
    "isPassed" BOOLEAN,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ExamQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "category" TEXT,
    "visibility" TEXT NOT NULL DEFAULT 'internal',
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "options" TEXT,
    "answer" TEXT NOT NULL,
    "explanation" TEXT,
    "score" REAL NOT NULL DEFAULT 1,
    "examCount" INTEGER NOT NULL DEFAULT 0,
    "wrongCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Exam" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "templateType" TEXT NOT NULL DEFAULT 'random',
    "questionIds" TEXT NOT NULL,
    "totalScore" REAL NOT NULL,
    "passScore" REAL NOT NULL,
    "examTimeLimit" INTEGER,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "maxAttempts" INTEGER NOT NULL DEFAULT 1,
    "targetUsers" TEXT,
    "isPractice" BOOLEAN NOT NULL DEFAULT false,
    "signMethod" TEXT NOT NULL DEFAULT 'qr',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ExamRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "examId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "attempt" INTEGER NOT NULL DEFAULT 1,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME,
    "score" REAL,
    "isPassed" BOOLEAN,
    "answers" TEXT,
    "signInTime" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SafetyTraining" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "trainType" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trainDate" DATETIME NOT NULL,
    "content" TEXT,
    "teacher" TEXT,
    "hours" REAL,
    "testScore" REAL,
    "traineeSign" TEXT,
    "teacherSign" TEXT,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "fileUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "MentorApprentice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "apprenticeId" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'active',
    "agreementFileUrl" TEXT,
    "assessmentFileUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT,
    "model" TEXT,
    "spec" TEXT,
    "manufacturer" TEXT,
    "purchaseDate" DATETIME,
    "commissionDate" DATETIME,
    "responsibleDept" TEXT,
    "status" TEXT NOT NULL DEFAULT 'in_use',
    "fileUrl" TEXT,
    "remark" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EquipmentMaintenance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "equipmentId" TEXT NOT NULL,
    "planDate" DATETIME NOT NULL,
    "actualDate" DATETIME,
    "type" TEXT NOT NULL,
    "content" TEXT,
    "status" TEXT NOT NULL DEFAULT 'planned',
    "executor" TEXT,
    "result" TEXT,
    "fileUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EquipmentInspection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "equipmentId" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "inspectDate" DATETIME NOT NULL,
    "inspector" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "issues" TEXT,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Chemical" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "aliases" TEXT,
    "casNo" TEXT,
    "isHazardous" BOOLEAN NOT NULL DEFAULT false,
    "isEasyToxic" BOOLEAN NOT NULL DEFAULT false,
    "isExplosive" BOOLEAN NOT NULL DEFAULT false,
    "isProhibited" BOOLEAN NOT NULL DEFAULT false,
    "sdsFileUrl" TEXT,
    "storageLocation" TEXT,
    "maxStock" REAL,
    "currentStock" REAL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "HazardFacility" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "location" TEXT,
    "status" TEXT NOT NULL DEFAULT 'normal',
    "lastInspectDate" DATETIME,
    "nextInspectDate" DATETIME,
    "qrCodeUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SpecialEquipment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "registrationNo" TEXT,
    "useOrg" TEXT,
    "commissionDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'in_use',
    "lastInspectDate" DATETIME,
    "nextInspectDate" DATETIME,
    "alertStatus" TEXT NOT NULL DEFAULT 'normal',
    "fileUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SpecialEquipmentInspection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "equipmentId" TEXT NOT NULL,
    "inspectDate" DATETIME NOT NULL,
    "nextInspectDate" DATETIME,
    "inspectOrg" TEXT,
    "result" TEXT NOT NULL,
    "inspector" TEXT,
    "fileUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "FireZone" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "zoneType" TEXT,
    "description" TEXT,
    "mapUrl" TEXT,
    "planFileUrl" TEXT,
    "fireGroup" TEXT,
    "ertMembers" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "FirePatrolPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "defaultPatrolBy" TEXT,
    "patrolItems" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "FirePatrol" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "planId" TEXT NOT NULL,
    "patrolDate" DATETIME NOT NULL,
    "patrolBy" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "issues" TEXT,
    "photoUrls" TEXT,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "FireEquipment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "location" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "manufactureDate" DATETIME,
    "expireDate" DATETIME,
    "inspectCycle" INTEGER NOT NULL DEFAULT 12,
    "lastInspectDate" DATETIME,
    "nextInspectDate" DATETIME,
    "qrCodeUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'normal',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RiskFactor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "level" TEXT NOT NULL DEFAULT 'low',
    "measures" TEXT,
    "reviewDate" DATETIME,
    "reviewer" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SafetyObservation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "obsType" TEXT NOT NULL,
    "observer" TEXT NOT NULL,
    "observedUser" TEXT,
    "location" TEXT,
    "date" DATETIME NOT NULL,
    "content" TEXT,
    "photos" TEXT,
    "issues" TEXT,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "followUpStatus" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Contractor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unifiedCode" TEXT,
    "licenseNo" TEXT,
    "licenseExpiry" DATETIME,
    "contactPerson" TEXT,
    "contactPhone" TEXT,
    "address" TEXT,
    "qualificationFileUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ContractorApproval" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contractorId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "applyDate" DATETIME NOT NULL,
    "reviewDate" DATETIME,
    "result" TEXT NOT NULL DEFAULT 'pending',
    "reviewer" TEXT,
    "comment" TEXT,
    "fileUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ContractorBlacklist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contractorId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "blacklistDate" DATETIME NOT NULL,
    "unblockDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ChangeRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "changeNo" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "changeType" TEXT NOT NULL,
    "description" TEXT,
    "riskAssessment" TEXT,
    "measures" TEXT,
    "applicantId" TEXT NOT NULL,
    "applyDate" DATETIME NOT NULL,
    "approveStatus" TEXT NOT NULL DEFAULT 'draft',
    "fileUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WorkPermit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "permitNo" TEXT NOT NULL,
    "workType" TEXT NOT NULL,
    "workLevel" TEXT,
    "title" TEXT NOT NULL,
    "location" TEXT,
    "description" TEXT,
    "workContent" TEXT,
    "workStartTime" DATETIME,
    "workEndTime" DATETIME,
    "applicantId" TEXT NOT NULL,
    "supervisorId" TEXT,
    "workPersonIds" TEXT,
    "riskAssessment" TEXT,
    "measures" TEXT,
    "safetyBriefingFileUrl" TEXT,
    "preWorkConfirmBy" TEXT,
    "preWorkConfirmTime" DATETIME,
    "postWorkConfirmBy" TEXT,
    "postWorkConfirmTime" DATETIME,
    "approveStatus" TEXT NOT NULL DEFAULT 'draft',
    "approveHistory" TEXT,
    "gpsLocation" TEXT,
    "permitValidHours" INTEGER NOT NULL DEFAULT 8,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "issueFound" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WorkUnit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "parentId" TEXT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "qrCodeUrl" TEXT,
    "warningSignUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WorkUnit_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "WorkUnit" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RiskControlList" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "workUnitId" TEXT,
    "hazardSource" TEXT NOT NULL,
    "riskCategory" TEXT NOT NULL,
    "potentialConsequence" TEXT,
    "riskLevel" TEXT NOT NULL DEFAULT 'low',
    "isMajorAbove" BOOLEAN NOT NULL DEFAULT false,
    "controlMeasures" TEXT,
    "initialAssessmentDate" DATETIME,
    "assessmentGroup" TEXT,
    "changeLog" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RiskChange" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "riskControlId" TEXT NOT NULL,
    "changeType" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "assessorId" TEXT NOT NULL,
    "assessmentDate" DATETIME NOT NULL,
    "oldLevel" TEXT,
    "newLevel" TEXT,
    "conclusion" TEXT,
    "fileUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "RiskReview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "reviewDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reportFileUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RiskMap" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "workUnitId" TEXT,
    "areaName" TEXT,
    "mapData" TEXT NOT NULL,
    "mapImageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RiskInspectionConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "riskControlId" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "inspectLevel" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RiskInspection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "configId" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "inspectDate" DATETIME NOT NULL,
    "inspectorId" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "issues" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "InspectionPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "planType" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "noticeFileUrl" TEXT,
    "teamMembers" TEXT,
    "checklist" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Hazard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "hazardNo" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "type" TEXT NOT NULL,
    "category" TEXT,
    "area" TEXT,
    "source" TEXT,
    "sourceId" TEXT,
    "riskLevel" TEXT NOT NULL DEFAULT 'general',
    "isMajor" BOOLEAN NOT NULL DEFAULT false,
    "foundDate" DATETIME NOT NULL,
    "fixDeadline" DATETIME,
    "assigneeId" TEXT,
    "verifierId" TEXT,
    "fixMeasures" TEXT,
    "fixStatus" TEXT NOT NULL DEFAULT 'pending',
    "verifyResult" TEXT,
    "verifyTime" DATETIME,
    "photos" TEXT,
    "improvementPlan" TEXT,
    "deleteApplyStatus" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "HazardReward" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hazardId" TEXT NOT NULL,
    "rewardType" TEXT NOT NULL,
    "rewardAmount" REAL NOT NULL,
    "rewardDesc" TEXT,
    "awardTime" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ViolationClause" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "clauseNo" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 1,
    "category" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Violation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "linkedUsers" TEXT,
    "clauseId" TEXT NOT NULL,
    "violationDate" DATETIME NOT NULL,
    "description" TEXT,
    "photoUrls" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "handleResult" TEXT,
    "handleDate" DATETIME,
    "reporter" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "OccupationalHazardPosition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "positionName" TEXT NOT NULL,
    "hazardFactor" TEXT,
    "hazardLevel" TEXT,
    "remark" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "OccupationalExposurePerson" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "positionId" TEXT NOT NULL,
    "exposureStartDate" DATETIME NOT NULL,
    "exposureEndDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "OccupationalExamPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "planType" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "targetCount" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "OccupationalExamResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "planId" TEXT,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "examDate" DATETIME NOT NULL,
    "examOrg" TEXT,
    "resultType" TEXT NOT NULL,
    "resultDetail" TEXT,
    "reportFileUrl" TEXT,
    "signStatus" TEXT NOT NULL DEFAULT 'pending',
    "signTime" DATETIME,
    "noticeFileUrl" TEXT,
    "transferNoticeFileUrl" TEXT,
    "processStatus" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ProtectiveFacility" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "type" TEXT,
    "location" TEXT,
    "hazardFactorId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'normal',
    "lastInspectDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "DosimeterRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deviceNo" TEXT,
    "wearStartDate" DATETIME NOT NULL,
    "wearEndDate" DATETIME,
    "doseValue" REAL,
    "isAbnormal" BOOLEAN NOT NULL DEFAULT false,
    "reportFileUrl" TEXT,
    "signStatus" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "WarningSign" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "hazardFactor" TEXT NOT NULL,
    "location" TEXT,
    "signType" TEXT,
    "photoUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'normal',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PPEItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "standard" TEXT,
    "sizes" TEXT,
    "unitPrice" REAL,
    "stockQty" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PPEIssue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ppeItemId" TEXT NOT NULL,
    "size" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "applyReason" TEXT,
    "applyDate" DATETIME NOT NULL,
    "approveStatus" TEXT NOT NULL DEFAULT 'pending',
    "approverId" TEXT,
    "approveTime" DATETIME,
    "issueStatus" TEXT NOT NULL DEFAULT 'pending',
    "issueDate" DATETIME,
    "issueBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "EmergencyPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "planType" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "content" TEXT,
    "fileUrl" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "publishTime" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DrillPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "planType" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER,
    "title" TEXT NOT NULL,
    "drillDate" DATETIME,
    "location" TEXT,
    "form" TEXT,
    "organizerId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "planFileUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DrillRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "planId" TEXT NOT NULL,
    "drillDate" DATETIME NOT NULL,
    "location" TEXT,
    "photos" TEXT,
    "videos" TEXT,
    "participants" TEXT,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "DrillAssessment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recordId" TEXT NOT NULL,
    "assessorId" TEXT NOT NULL,
    "applicabilityScore" REAL,
    "timelinessScore" REAL,
    "effectivenessScore" REAL,
    "conclusion" TEXT,
    "suggestions" TEXT,
    "reportFileUrl" TEXT,
    "approveStatus" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "EmergencyTeam" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "teamType" TEXT NOT NULL,
    "leaderId" TEXT,
    "members" TEXT,
    "specialty" TEXT,
    "contactPhone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EmergencySupplies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "unit" TEXT,
    "purpose" TEXT,
    "location" TEXT,
    "checkDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'normal',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AccidentReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "accidentNo" TEXT NOT NULL,
    "accidentType" TEXT NOT NULL,
    "accidentLevel" TEXT NOT NULL DEFAULT 'general',
    "title" TEXT NOT NULL,
    "location" TEXT,
    "happenTime" DATETIME NOT NULL,
    "reportTime" DATETIME NOT NULL,
    "reporterId" TEXT NOT NULL,
    "description" TEXT,
    "initialHandling" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "photos" TEXT,
    "fileUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AccidentInvestigation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reportId" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "investigationGroup" TEXT,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "directCause" TEXT,
    "indirectCause" TEXT,
    "rootCause" TEXT,
    "analysisMethod" TEXT,
    "reportFileUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AccidentActionPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "investigationId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "responsibleId" TEXT,
    "deadline" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "verifyResult" TEXT,
    "verifyBy" TEXT,
    "verifyTime" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AccidentCommunication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reportId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "fileUrl" TEXT,
    "publishBy" TEXT,
    "publishTime" DATETIME,
    "studyStatus" TEXT NOT NULL DEFAULT 'pending',
    "studySign" TEXT,
    "examScore" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AccidentResponsibility" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reportId" TEXT NOT NULL,
    "responsibleUser" TEXT NOT NULL,
    "responsibilityType" TEXT NOT NULL,
    "handleResult" TEXT,
    "handleDate" DATETIME,
    "fileUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AccidentArchive" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reportId" TEXT NOT NULL,
    "archiveType" TEXT NOT NULL,
    "fileUrl" TEXT,
    "fileContent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PerformanceReview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "reviewType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "scope" TEXT,
    "assessorId" TEXT,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "score" REAL,
    "result" TEXT,
    "reportFileUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ContinuousImprovement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "reviewId" TEXT,
    "title" TEXT NOT NULL,
    "gap" TEXT,
    "improvementPlan" TEXT,
    "responsibleId" TEXT,
    "deadline" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "verifyResult" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TodoItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "module" TEXT NOT NULL,
    "refId" TEXT,
    "refType" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "dueDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "readAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "type" TEXT NOT NULL,
    "module" TEXT,
    "refId" TEXT,
    "level" TEXT NOT NULL DEFAULT 'info',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "WorkSafetyCheck" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "checkType" TEXT NOT NULL,
    "checker" TEXT NOT NULL,
    "checkDate" DATETIME NOT NULL,
    "items" TEXT,
    "result" TEXT NOT NULL,
    "issues" TEXT,
    "photos" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "DeepCastMonitor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "cameraId" TEXT,
    "cameraName" TEXT,
    "alarmType" TEXT NOT NULL,
    "alarmLevel" TEXT NOT NULL DEFAULT 'warning',
    "alarmTime" DATETIME NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "acknowledgeBy" TEXT,
    "acknowledgeTime" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SafetyScore" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "orgName" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER,
    "trainingScore" REAL NOT NULL DEFAULT 0,
    "hazardScore" REAL NOT NULL DEFAULT 0,
    "violationScore" REAL NOT NULL DEFAULT 0,
    "accidentScore" REAL NOT NULL DEFAULT 0,
    "newEmployeeScore" REAL NOT NULL DEFAULT 0,
    "hpScore" REAL NOT NULL DEFAULT 0,
    "totalScore" REAL NOT NULL DEFAULT 0,
    "alertLevel" TEXT NOT NULL DEFAULT 'green',
    "detail" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_code_key" ON "Organization"("code");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_employeeNo_key" ON "User"("employeeNo");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Role_code_key" ON "Role"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Authorization_userId_roleId_module_key" ON "Authorization"("userId", "roleId", "module");

-- CreateIndex
CREATE UNIQUE INDEX "SystemParameter_key_key" ON "SystemParameter"("key");

-- CreateIndex
CREATE UNIQUE INDEX "UserCourse_courseId_userId_key" ON "UserCourse"("courseId", "userId");
