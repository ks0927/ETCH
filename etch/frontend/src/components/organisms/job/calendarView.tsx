import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { JobItemProps } from "../../atoms/listItem";
import BookmarkSVG from "../../svg/bookmarkSVG";

interface CalendarViewProps {
  jobList: JobItemProps[];
  onEventClick?: (jobId: string) => void;
}

function CalendarView({ jobList, onEventClick }: CalendarViewProps) {
  const convertJobsToEvents = (jobs: JobItemProps[]) => {
    const events = [];

    for (const job of jobs) {
      // 시작일 이벤트
      events.push({
        id: `${job.id}-start`,
        title: `🚀 ${job.company}`,
        date: job.opening_date,
        backgroundColor: "#bfdbfe",
        borderColor: "transparent",
        textColor: "#1f2937",
        extendedProps: {
          type: "start",
          company: job.company,
          location: job.location,
          tags: job.tags,
          opening_date: job.opening_date,
          expiration_date: job.expiration_date,
          originalId: job.id,
        },
      });

      // 마감일 이벤트
      events.push({
        id: `${job.id}-end`,
        title: `⏰ ${job.company}`,
        date: job.expiration_date,
        backgroundColor: "#d1d5db",
        borderColor: "transparent",
        textColor: "#1f2937",
        extendedProps: {
          type: "end",
          company: job.company,
          location: job.location,
          tags: job.tags,
          opening_date: job.opening_date,
          expiration_date: job.expiration_date,
          originalId: job.id,
        },
      });
    }

    return events;
  };

  const handleEventClick = (clickInfo: any) => {
    if (onEventClick) {
      const originalId = clickInfo.event.extendedProps.originalId;
      onEventClick(originalId);
    }
  };

  const renderEventContent = (eventInfo: any) => {
    const { event } = eventInfo;
    const { type, company } = event.extendedProps;

    return (
      <div className="flex items-center justify-between w-full px-1">
        <span className="flex-1 truncate text-xs">
          {type === "start" ? "🚀" : "⏰"} {company}
        </span>
        <button
          className="ml-1 opacity-70 hover:opacity-100 flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            console.log("북마크 클릭:", company);
          }}
        >
          <BookmarkSVG />
        </button>
      </div>
    );
  };

  const events = convertJobsToEvents(jobList);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <style>{`
          .fc-toolbar-title {
            font-size: 1.2rem !important;
            font-weight: 600 !important;
            color: #111827;
          }
          .fc-button-primary {
            background: #f3f4f6 !important;
            border: 1px solid #d1d5db !important;
            color: #374151 !important;
            border-radius: 6px !important;
            padding: 0.25rem 0.75rem !important;
            font-size: 0.875rem !important;
            font-weight: 500 !important;
            transition: all 0.2s ease !important;
          }
          .fc-button-primary:hover {
            background: #e5e7eb !important;
            border-color: #9ca3af !important;
          }
          .fc-button-primary:focus {
            box-shadow: 0 0 0 2px rgba(0, 125, 252, 0.2) !important;
          }
          .fc-daygrid-day-number {
            color: #374151;
            font-weight: 500;
            padding: 0.25rem;
          }
          .fc-day-today {
            background-color: #ecfdf5 !important;
            border: 1px solid #10b981 !important;
          }
          .fc-event {
            border-radius: 4px !important;
            border: none !important;
            padding: 0.125rem 0.25rem !important;
            margin: 0.125rem 0 !important;
            font-size: 0.75rem !important;
            font-weight: 500 !important;
            cursor: pointer !important;
          }
          .fc-event:hover {
            opacity: 0.9 !important;
          }
          .fc-col-header-cell {
            background: #f9fafb !important;
            padding: 0.5rem 0 !important;
            font-weight: 600 !important;
            color: #6b7280 !important;
            text-transform: uppercase !important;
            font-size: 0.75rem !important;
            letter-spacing: 0.025em !important;
          }
          .fc-theme-standard td,
          .fc-theme-standard th {
            border-color: #e5e7eb !important;
          }
        `}</style>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth",
        }}
        events={events}
        eventClick={handleEventClick}
        height="auto"
        locale="ko"
        displayEventTime={false}
        aspectRatio={1.8}
        eventDisplay="block"
        dayMaxEvents={3}
        moreLinkClick="popover"
        eventContent={renderEventContent}
      />
    </div>
  );
}

export default CalendarView;
