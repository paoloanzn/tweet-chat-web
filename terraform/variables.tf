variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "region" {
  description = "The region to deploy to"
  type        = string
  default     = "us-central1"  # Default region, can be overridden
}

variable "service_name" {
  description = "The name of the Cloud Run service"
  type        = string
  default     = "tweet-chat-api"
}

variable "container_image" {
  description = "The container image to deploy"
  type        = string
}

# Environment variables for the service
variable "env_vars" {
  description = "Environment variables for the service"
  type = map(string)
  default = {}
  sensitive = true  # This marks the variable as sensitive in logs
}

# Add this to your existing variables
variable "credentials_file" {
  description = "Path to the service account key JSON file"
  type        = string
  default     = "service-account-key.json"
} 