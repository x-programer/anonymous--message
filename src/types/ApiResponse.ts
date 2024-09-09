import {Message} from '@/model/User'

//THis is for how our api response should be ..
export interface ApiResponse {
    success: boolean,
    message: string,
    isAccesptingMessage?: boolean,
    messages?: Array<Message>
}