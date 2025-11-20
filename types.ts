/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


export interface Company {
  id: string;
  name: string;
  sector: string; // Previously genre
  image: string;
  stage: string; // Previously day (e.g. Seed, Series A)
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export enum Section {
  HERO = 'hero',
  PORTFOLIO = 'portfolio',
  THESIS = 'thesis',
  CONNECT = 'connect',
}