import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadGatewayException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError(error => {
                console.error(error);
                console.error("popat errror aa gya yaar");
                const message = error.message || 'Something went wrong popat';
                return throwError(new BadGatewayException(message));
            })
        );
    }
}