import {Facility} from './facility';

export class FacilityDashboard {
  id: number;

  facility: Facility;
  date?: Date;

  name?: string;
  data?: FacilityDashboardData;

  public static getEndingStyle(data: any) {
    let style = {};

    if (data.ending_occupancy > data.capacity_yellow) {
      style = {'background-color': '#a2ddb7'};
    } else if (data.ending_occupancy > data.break_even && data.ending_occupancy <= data.capacity_yellow) {
      style = {'background-color': '#ffdf7e'};
    } else if (data.ending_occupancy <= data.break_even) {
      style = {'background-color': '#ed969e', 'color': 'white', 'font-weight': 'bold'};
    }

    return style;
  }
}

class FacilityDashboardData {
  average_room_rent: number;
  break_even: number;
  capacity_yellow: number;
  ending_occupancy: number;
  events_per_month: number;
  hot_leads: number;
  move_ins_long_term: number;
  move_ins_respite: number;
  move_outs_long_term: number;
  move_outs_respite: number;
  notice_to_vacate: number;
  outreach_per_month: number;
  projected_near_term_occupancy: number;
  qualified_inquiries: number;
  starting_occupancy: number;
  total_capacity: number;
  total_inquiries: number;
  tours_per_month: number;
}