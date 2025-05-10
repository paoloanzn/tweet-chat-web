/**
 * @typedef {Object} Message
 * @property {string} role - The role of the message sender (e.g., 'user', 'assistant')
 * @property {string} message - The content of the message
 * @property {number} timestamp - Unix timestamp in seconds
 */

/**
 * Validates if an object conforms to the Message type structure.
 *
 * @param {Object} obj - The object to validate
 * @param {string} obj.role - The role of the message sender
 * @param {string} obj.message - The content of the message
 * @param {number} obj.timestamp - Unix timestamp in seconds
 * @returns {boolean} True if object is a valid Message, false otherwise
 */
export function isValidMessage(obj) {
  const validRoles = ["user", "persona"];
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.role === "string" &&
    validRoles.includes(obj.role) &&
    typeof obj.message === "string" &&
    typeof obj.timestamp === "number"
  );
}
