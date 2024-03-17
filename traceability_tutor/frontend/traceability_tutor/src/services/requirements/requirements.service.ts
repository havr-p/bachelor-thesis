import { Injectable } from '@angular/core';
import {Requirement} from "../../app/models/requirement";

@Injectable({
  providedIn: 'root'
})
export class RequirementsService {

  constructor() { }

  async fetchRequirements(): Promise<Requirement[]> {
   const response = await fetch('http://localhost:5555/requirements/all');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const rawData = await response.json();
  return rawData;
}
}
