import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardAction } from "@components/ui/card.tsx";
import { Files ,Upload} from "lucide-react"
import {Button} from "@components/ui/button.tsx";

export interface AttachmentSectionProps {
    referenceId: string;
    referenceType: string;
    isReadOnly: boolean
}

export function AttachmentSection({ referenceId, referenceType, isReadOnly }: AttachmentSectionProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Tệp đính kèm</CardTitle>
                <CardDescription>Tệp đính kèm hóa đơn</CardDescription>
                <CardAction>
                    {!isReadOnly && (
                        <Button type="button" onClick={() => { }}>
                            <Upload className="w-4 h-4 mr-2" /> Tải lên
                        </Button>
                    )}
                </CardAction>
            </CardHeader>
            <CardContent>

            </CardContent>

        </Card>
    )
}
