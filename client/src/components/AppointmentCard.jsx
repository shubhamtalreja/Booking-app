import React from 'react';
import { format, isPast } from 'date-fns';
import './AppointmentCard.css';
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const AppointmentCard = ({ appointment, onCancel }) => {
    if (!appointment || !appointment.service) {
        return null;
    }

    const isAppointmentPast = isPast(new Date(appointment.startTime));

    return (
        <div className='gap-2 p-2'>
            <Card className={isAppointmentPast ? "opacity-60" : ""}>
                <CardHeader>
                    <CardTitle>{appointment.service.name}</CardTitle>
                    <CardDescription>
                        {format(new Date(appointment.startTime), "EEEE, MMMM do, yyyy")}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <p>
                        <strong>Time:</strong>{" "}
                        {`${format(new Date(appointment.startTime), "p")} - ${format(
                            new Date(appointment.endTime),
                            "p"
                        )}`}
                    </p>
                    <p>
                        <strong>Price:</strong> &#8377;{appointment.service.price}
                    </p>
                </CardContent>

                {!isAppointmentPast && (
                    <CardFooter>
                        <Button
                            variant="destructive"
                            onClick={() => onCancel(appointment._id)}
                        >
                            Cancel Appointment
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
};

export default AppointmentCard;