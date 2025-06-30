import { Calendar } from "@/components/ui/calendar";
import React from "react";



export default function CalendarApp() {
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    
    return (
        <div className="bg-[#70798C] p-12 rounded-xl w-80 h-90 flex flex-col items-center justify-center space-y-4">
            <div className="text-white text-m font-medium text-center">
                <p>Calendar</p>
            </div>
            <div>
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-lg border "
                />
            </div>
        </div>
    )
}                                  