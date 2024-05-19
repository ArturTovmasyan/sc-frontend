import {Facility} from './facility';

export class FacilityDashboard {
  id: number;

  facility: Facility;
  date?: Date;

  name?: string;
  data?: FacilityDashboardData;

  public static getStartingStyle(data: any) {
    let style;

    if (data.starting_occupancy <= data.yellow_flag && data.starting_occupancy > data.red_flag) {
      style = {'background-color': '#ffdf7e'};
    } else if (data.starting_occupancy < data.yellow_flag && data.starting_occupancy <= data.red_flag) {
      style = {'background-color': '#ed969e', 'color': 'white', 'font-weight': 'bold'};
    } else {
      style = {'background-color': '#a2ddb7'};
    }

    return style;
  }

  public static getEndingStyle(data: any) {
    let style;

    if (data.ending_occupancy <= data.yellow_flag && data.ending_occupancy > data.red_flag) {
      style = {'background-color': '#ffdf7e'};
    } else if (data.ending_occupancy < data.yellow_flag && data.ending_occupancy <= data.red_flag) {
      style = {'background-color': '#ed969e', 'color': 'white', 'font-weight': 'bold'};
    } else {
      style = {'background-color': '#a2ddb7'};
    }

    return style;
  }
}

class FacilityDashboardData {
  average_room_rent: number;
  red_flag: number;
  yellow_flag: number;
  ending_occupancy: number;
  resident_events: number;
  hot_leads: number;
  move_ins_long_term: number;
  move_ins_respite: number;
  move_outs_long_term: number;
  move_outs_respite: number;
  notice_to_vacate: number;
  outreach_per_month: number;
  projected_near_term_occupancy: number;
  qualified_inquiries: number;
  not_sure_inquiries: number;
  not_qualified_inquiries: number;
  starting_occupancy: number;
  beds_licensed: number;
  beds_target: number;
  beds_configured: number;
  total_inquiries: number;
  tours_per_month: number;
  hospice: number;
}
