import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Response } from 'express';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) { }

  @Post()
  create(@Body() createSettingDto: CreateSettingDto) {
    return this.settingsService.create(createSettingDto);
  }


  @Get()
  findAll(@Res() res: Response) {
    return res.render('settings', { title: 'Hello setting' });
  }
  @Post(':add')
  addData(@Res() res: Response, @Body() requestInput: CreateSettingDto) {
    console.log("requestInput-->", requestInput)
    return res.render('settings', { title: 'Hello popat' });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.settingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSettingDto: UpdateSettingDto) {
    return this.settingsService.update(+id, updateSettingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.settingsService.remove(+id);
  }
}
