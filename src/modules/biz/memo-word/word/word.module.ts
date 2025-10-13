import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WordService } from './word.service';
import { WordController } from './word.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Word } from '../entities/words.entity';
import { UserWord } from '../entities/userWord.entity';
import { Tag } from '../entities/wordTags.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Word, UserWord, Tag]), HttpModule],
  providers: [WordService],
  controllers: [WordController],
})
export class WordModule {}
