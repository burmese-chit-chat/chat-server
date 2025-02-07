import { Response } from "express";
interface IPagination {
    total : number;
    page : number;
}

export function send_response (res: Response, status: number, data: any, message: string, token?: string , pagination? : IPagination) {
    res.status(status).json({
        data: data,
        message: message,
        token: token ? token : null, 
        pagination: pagination ? pagination : null
    });
}

export function send_error_response(res: Response, status: number, message: string) {
    res.status(status).send({
        message: message
    });
}