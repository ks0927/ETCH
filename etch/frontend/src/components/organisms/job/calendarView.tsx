import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { JobItemProps } from "../../atoms/listItem";
import BookmarkSVG from "../../svg/bookmarkSVG";

interface CalendarViewProps {
  jobList: JobItemProps[];
  onEventClick?: (jobId: string) => void;
  onDateRangeChange?: (startDate: Date, endDate: Date) => void;
}

function CalendarView({
  jobList,
  onEventClick,
  onDateRangeChange,
}: CalendarViewProps) {
  const convertJobsToEvents = (jobs: JobItemProps[]) => {
    const events = [];

    for (const job of jobs) {
      // 태그들을 조합 (배열이 아닐 수 있으므로 안전하게 처리)
      const safeJobCategories = Array.isArray(job.jobCategories)
        ? job.jobCategories
        : [];
      const safeIndustries = Array.isArray(job.industries)
        ? job.industries
        : [];
      const safeRegions = Array.isArray(job.regions) ? job.regions : [];
      const allTags = [
        ...safeJobCategories,
        ...safeIndustries,
        job.workType,
        job.educationLevel,
      ].filter(Boolean);

      // 시작일 이벤트
      events.push({
        id: `${job.id}-start`,
        title: `🚀 ${job.companyName}`,
        start: job.openingDate,
        allDay: true,
        backgroundColor: "#bfdbfe",
        borderColor: "transparent",
        textColor: "#1f2937",
        display: "block",
        extendedProps: {
          type: "start",
          companyName: job.companyName,
          regions: safeRegions,
          tags: allTags,
          openingDate: job.openingDate,
          expirationDate: job.expirationDate,
          originalId: job.id,
        },
      });

      // 마감일 이벤트
      events.push({
        id: `${job.id}-end`,
        title: `⏰ ${job.companyName}`,
        start: job.expirationDate,
        allDay: true,
        backgroundColor: "#d1d5db",
        borderColor: "transparent",
        textColor: "#1f2937",
        display: "block",
        extendedProps: {
          type: "end",
          companyName: job.companyName,
          regions: safeRegions,
          tags: allTags,
          openingDate: job.openingDate,
          expirationDate: job.expirationDate,
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

  const handleDatesSet = (dateInfo: any) => {
    console.log("[CalendarView] handleDatesSet called with:", dateInfo);
    // dateInfo.start: 달력에서 보이는 첫 번째 날짜 (7월 27일)
    // dateInfo.end: 달력에서 보이는 마지막 날짜 + 1 (9월 7일)
    const startDate = new Date(dateInfo.start);
    const endDate = new Date(dateInfo.end);
    endDate.setDate(endDate.getDate() - 1); // end는 다음날이므로 1일 빼기

    console.log("[CalendarView] Processed dates:", {
      originalStart: dateInfo.start,
      originalEnd: dateInfo.end,
      processedStart: startDate,
      processedEnd: endDate,
    });

    // 여러 날짜 타입에 대응 가능한 포맷 함수
    const formatDate = (date: Date | string) => {
      if (typeof date === "string") {
        // 이미 "YYYY-MM-DD" 형태라면 그대로 반환
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          return date;
        }
        // 다른 문자열 형태라면 Date 객체로 변환 후 처리
        date = new Date(date);
      }

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    console.log("[CalendarView] 달력 범위 변경:", {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      startDateObj: startDate,
      endDateObj: endDate,
      rawStart: dateInfo.start,
      rawEnd: dateInfo.end,
      hasCallback: !!onDateRangeChange,
    });

    if (onDateRangeChange) {
      console.log("[CalendarView] Calling onDateRangeChange callback");
      onDateRangeChange(startDate, endDate);
    } else {
      console.log("[CalendarView] No onDateRangeChange callback provided");
    }
  };

  const renderEventContent = (eventInfo: any) => {
    const { event } = eventInfo;
    const { type, companyName } = event.extendedProps;

    return (
      <div className="flex items-center justify-between w-full px-1">
        <span className="flex-1 text-xs truncate">
          {type === "start" ? "🚀" : "⏰"} {companyName}
        </span>
        <button
          className="flex-shrink-0 ml-1 opacity-70 hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            console.log("북마크 클릭:", companyName);
          }}
        >
          <BookmarkSVG />
        </button>
      </div>
    );
  };

  const events = convertJobsToEvents(jobList);

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg">
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
            margin: 0 !important;
            font-size: 0.7rem !important;
            font-weight: 500 !important;
            cursor: pointer !important;
            height: auto !important;
            min-height: 16px !important;
          }
          .fc-daygrid-day-frame {
            min-height: 140px !important;
            padding: 0.25rem !important;
          }
          .fc-daygrid-day-events {
            padding: 0.125rem !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 0.6rem !important;
          }
          .fc-daygrid-event-harness {
            margin: 0 !important;
          }
          .fc-popover {
            display: none !important;
          }
          .fc-more-popover {
            display: none !important;
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
        datesSet={handleDatesSet}
        height="auto"
        locale="ko"
        displayEventTime={false}
        aspectRatio={1.2}
        eventDisplay="block"
        dayMaxEvents={7}
        moreLinkClick={(info: any) => {
          console.log("moreLinkClick info:", info);

          // 기존 FullCalendar popover 강제로 숨기기
          setTimeout(() => {
            const existingPopovers = document.querySelectorAll(
              ".fc-popover, .fc-more-popover"
            );
            existingPopovers.forEach((popover) => {
              if (popover && popover.parentNode) {
                popover.parentNode.removeChild(popover);
              }
            });
          }, 0);

          // 커스텀 popover 생성
          const popover = document.createElement("div");
          popover.className = "custom-more-popover"; // fc- 클래스명 제거
          popover.style.cssText = `
            position: fixed;
            z-index: 9999;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            padding: 12px;
            min-width: 250px;
            max-width: 300px;
          `;

          // 헤더 생성
          const header = document.createElement("div");
          header.style.cssText = `
            font-weight: 600;
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 1px solid #eee;
            font-size: 14px;
            color: #374151;
          `;
          header.textContent = `${info.date.toLocaleDateString(
            "ko-KR"
          )} 일정 (${info.allSegs.length}개)`;
          popover.appendChild(header);

          // 이벤트 목록 컨테이너
          const eventsContainer = document.createElement("div");
          eventsContainer.style.cssText = `
            max-height: 300px;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: #cbd5e1 #f1f5f9;
            display: flex;
            flex-direction: column;
            gap: 8px;
          `;

          // 각 이벤트 아이템 생성
          info.allSegs.forEach((seg: any) => {
            const eventEl = document.createElement("div");
            eventEl.style.cssText = `
              padding: 10px 12px;
              border-radius: 6px;
              cursor: pointer;
              font-size: 13px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              background-color: ${seg.event.backgroundColor || "#f3f4f6"};
              color: ${seg.event.textColor || "#374151"};
              transition: opacity 0.2s;
            `;

            // 이벤트 제목 부분
            const titleSpan = document.createElement("span");
            titleSpan.style.cssText = `
              flex: 1;
              truncate: true;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            `;
            titleSpan.textContent = seg.event.title;

            // 북마크 버튼 부분
            const bookmarkBtn = document.createElement("button");
            bookmarkBtn.style.cssText = `
              margin-left: 10px;
              opacity: 0.7;
              background: none;
              border: none;
              cursor: pointer;
              padding: 4px;
              display: flex;
              align-items: center;
              flex-shrink: 0;
              border-radius: 4px;
              transition: background-color 0.2s;
            `;
            bookmarkBtn.innerHTML = `
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
              </svg>
            `;
            bookmarkBtn.addEventListener("mouseenter", () => {
              bookmarkBtn.style.opacity = "1";
              bookmarkBtn.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
            });
            bookmarkBtn.addEventListener("mouseleave", () => {
              bookmarkBtn.style.opacity = "0.7";
              bookmarkBtn.style.backgroundColor = "transparent";
            });
            bookmarkBtn.addEventListener("click", (e) => {
              e.stopPropagation();
              const companyName = seg.event.extendedProps.companyName;
              console.log("북마크 클릭:", companyName);
            });

            eventEl.appendChild(titleSpan);
            eventEl.appendChild(bookmarkBtn);

            eventEl.addEventListener("mouseenter", () => {
              eventEl.style.opacity = "0.8";
            });
            eventEl.addEventListener("mouseleave", () => {
              eventEl.style.opacity = "1";
            });
            eventEl.addEventListener("click", (e) => {
              // 북마크 버튼 클릭이 아닌 경우에만 이벤트 클릭 처리
              if (
                e.target !== bookmarkBtn &&
                !bookmarkBtn.contains(e.target as Node)
              ) {
                if (onEventClick) {
                  const originalId = seg.event.extendedProps.originalId;
                  onEventClick(originalId);
                }
                if (document.body.contains(popover)) {
                  document.body.removeChild(popover);
                }
              }
            });

            eventsContainer.appendChild(eventEl);
          });

          popover.appendChild(eventsContainer);

          // 닫기 버튼
          const closeBtn = document.createElement("button");
          closeBtn.innerHTML = "✕";
          closeBtn.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            background: none;
            border: none;
            font-size: 16px;
            cursor: pointer;
            color: #6b7280;
            padding: 4px;
            border-radius: 4px;
          `;
          closeBtn.addEventListener("click", () => {
            if (document.body.contains(popover)) {
              document.body.removeChild(popover);
            }
          });
          popover.appendChild(closeBtn);

          // 마우스 위치 기준으로 팝오버 위치 설정
          if (
            info.jsEvent &&
            (info.jsEvent as MouseEvent).clientX !== undefined
          ) {
            const mouseEvent = info.jsEvent as MouseEvent;
            const x = mouseEvent.clientX;
            const y = mouseEvent.clientY;
            popover.style.left = `${x}px`;
            popover.style.top = `${y + 10}px`;
          } else {
            // 화면 중앙에 표시
            popover.style.left = "50%";
            popover.style.top = "50%";
            popover.style.transform = "translate(-50%, -50%)";
          }

          document.body.appendChild(popover);

          // 화면 경계 확인 및 조정
          const popoverRect = popover.getBoundingClientRect();
          if (popoverRect.right > window.innerWidth) {
            popover.style.left = `${
              window.innerWidth - popoverRect.width - 10
            }px`;
            popover.style.transform = "none";
          }
          if (popoverRect.bottom > window.innerHeight) {
            const mouseEvent = info.jsEvent as MouseEvent;
            const newTop = mouseEvent?.clientY
              ? mouseEvent.clientY - popoverRect.height - 10
              : window.innerHeight / 2 - popoverRect.height / 2;
            popover.style.top = `${Math.max(10, newTop)}px`;
            popover.style.transform = "none";
          }

          // 외부 클릭시 닫기
          const closeOnOutsideClick = (e: Event) => {
            const target = e.target as Node;
            if (!popover.contains(target)) {
              if (document.body.contains(popover)) {
                document.body.removeChild(popover);
              }
              document.removeEventListener("click", closeOnOutsideClick);
            }
          };
          setTimeout(() => {
            document.addEventListener("click", closeOnOutsideClick);
          }, 100);

          return ""; // string 반환 (빈 문자열)
        }}
        eventContent={renderEventContent}
      />
    </div>
  );
}

export default CalendarView;
