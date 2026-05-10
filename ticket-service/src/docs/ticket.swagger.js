/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Ticket management APIs
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     Ticket:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 6820ab1234567890abcd1234
 *         title:
 *           type: string
 *           example: Cannot login
 *         description:
 *           type: string
 *           example: My password is not working
 *         customerId:
 *           type: string
 *           example: user123
 *         assignedAgentId:
 *           type: string
 *           nullable: true
 *           example: agent456
 *         status:
 *           type: string
 *           enum: [Open, In Progress, Resolved, Closed]
 *           example: Open
 *         priority:
 *           type: string
 *           enum: [Low, Medium, High]
 *           example: Medium
 *         resolvedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     CreateTicketInput:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         title:
 *           type: string
 *           example: Cannot login
 *         description:
 *           type: string
 *           example: Password reset link is not working
 */

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Create a new ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTicketInput'
 *     responses:
 *       201:
 *         description: Ticket created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Get all tickets for logged user
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/tickets/unassigned:
 *   get:
 *     summary: Get unassigned tickets (agents only)
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of unassigned tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     summary: Get ticket by ID
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 6820ab1234567890abcd1234
 *     responses:
 *       200:
 *         description: Ticket details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       404:
 *         description: Ticket not found
 */