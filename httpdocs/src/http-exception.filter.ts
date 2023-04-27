import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';


@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        if (status === HttpStatus.NOT_FOUND) {
            response.render('404');
        } else if (status === HttpStatus.GATEWAY_TIMEOUT) {
            response.render('504');
        } else if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
            response.render('500');
        } else {
            response.status(status).json({
                statusCode: status,
                message: exception.message,
            });
        }
    }
}