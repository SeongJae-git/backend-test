import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse();
        const status = exception.getStatus();
        const errorResponse = exception.getResponse();

        // 문자열인지 확인해서 문자열이면 그대로 쓰고 객체면 message값을 가져옴
        const message = typeof errorResponse === 'string' ? errorResponse : errorResponse['message'] || errorResponse;

        // 실패 시 응답 구조로 수정
        response.status(status).json({
            statusCode: status,
            message
        });
    }
}
