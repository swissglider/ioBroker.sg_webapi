import { Body, Controller, Get, Post, Res, UsePipes } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';
import { ValidationPipe } from './validation.pipe';

export class TestDTO {
    @IsNotEmpty()
    @IsString()
    public test!: string;
}

@Controller()
export class AppController {
    @Get()
    redirect(@Res() res: any) {
        return res.redirect('/help');
    }
    @Post('test')
    @UsePipes(new ValidationPipe({ meta: TestDTO }))
    public async test(@Body() test: TestDTO): Promise<any> {
        return { hallo: `Velo-_: ${test.test}` };
    }
}
