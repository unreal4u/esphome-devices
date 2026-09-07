#pragma once
#include <string>
#include <vector>

struct CalendarEvent {
	std::string cal_name = "";
	std::string summary = "";
	std::string start = "";
	std::string end = "";
	bool today = false;
};

extern std::vector<CalendarEvent> global_events;
