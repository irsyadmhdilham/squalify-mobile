import { isDevMode } from "@angular/core";

export function apiBaseUrl() {
  if (isDevMode) {
    return 'http://localhost:8030/api/v1';
  }
  return 'https://squalify.com/api/v1';
}