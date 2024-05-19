import {FunnelStage} from './funnel-stage';
import {StageChangeReason} from './stage-change-reason';
import {Lead} from './lead';

export class LeadFunnelStage implements IdInterface {
  id: number;

  lead: Lead;
  stage: FunnelStage;
  reason: StageChangeReason;
  date: Date;

  notes: string;
}

