import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Word } from '../entities/words.entity';
import {
  DelWordBody,
  ListWordBody,
  SaveWordBody,
  UpdateWordBody,
} from '../dto/word.dto';
import { UserWord } from '../entities/userWord.entity';

@Injectable()
export class WordService {
  constructor(
    @InjectRepository(Word)
    private readonly wordRepository: Repository<Word>,
    @InjectRepository(UserWord)
    private readonly userWordRepository: Repository<UserWord>,
  ) {}

  async getUserWords(params: ListWordBody, userId: number) {
    const {
      page = 1,
      pageSize = 10,
      sort = 'DESC',
      word,
      chineseMean,
    } = params;
    const skip = (page - 1) * pageSize;

    // 创建 QueryBuilder
    const queryBuilder = this.userWordRepository
      .createQueryBuilder('userWord')
      .innerJoinAndSelect('userWord.word', 'word')
      .where('userWord.userId = :userId', { userId });

    // 添加单词筛选条件
    if (word) {
      queryBuilder.andWhere('word.word LIKE :word', { word: `%${word}%` });
    }

    // 添加中文释义筛选条件
    if (chineseMean) {
      queryBuilder.andWhere('word.chineseMean LIKE :chineseMean', {
        chineseMean: `%${chineseMean}%`,
      });
    }

    // 排序
    const orderBy = sort === 'ASC' ? 'ASC' : 'DESC';
    queryBuilder.orderBy('userWord.userWordId', orderBy);

    // 分页
    queryBuilder.skip(skip).take(pageSize);

    const [result, total] = await queryBuilder.getManyAndCount();

    return {
      code: 200,
      message: '操作成功',
      result: {
        result,
        page,
        total,
      },
    };
  }

  async saveWords(params: SaveWordBody, userId: number) {
    let word = await this.wordRepository.findOneBy({
      word: params.word,
    });
    if (!word) {
      const _word = new Word();
      _word.word = params.word;
      _word.chineseMean = params.chineseMean;
      word = await this.wordRepository.save(_word);
    }
    const userWord = new UserWord();
    userWord.userId = userId;
    userWord.wordId = word.wordId;

    await this.userWordRepository.save(userWord);

    return {
      code: 200,
      message: '操作成功',
    };
  }

  async updateWord(params: UpdateWordBody) {
    const { userWordId, ...args } = params;
    await this.userWordRepository.update(
      { ...args },
      {
        userWordId,
      },
    );
    return {
      code: 200,
      message: '操作成功',
    };
  }

  async delWords(params: DelWordBody) {
    await this.userWordRepository.delete({ ...params });
    return { code: 200, message: '操作成功' };
  }
}
