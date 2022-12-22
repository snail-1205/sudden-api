import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Browser, Page, executablePath } from 'puppeteer';
import puppeteer from 'puppeteer-extra';

export type DefaultRes =
  | Partial<{
      ok: boolean;
      error: string;
      test: string[];
      playtime: string;
    }>
  | any;

@Injectable()
export class AppService {
  _browser: Browser | undefined;
  pages: Page[] = [];

  constructor() {
    this._init();
  }

  get browser() {
    if (this._browser) {
      return this._browser;
    }
    throw new Error('has not browser');
  }

  private async _init() {
    this._browser = await puppeteer.launch({
      devtools: false,
      args: ['--no-sandbox'],
      executablePath: executablePath(),
    });
    this.pages.push(...(await this._browser.pages()));
    this.pages.push(await this.browser.newPage());
  }

  getHello(): string {
    return 'Hello World!';
  }

  async getCoin(coin: string): Promise<DefaultRes> {
    const page = this.pages[0];

    if (coin == undefined) {
      return { ok: false, error: '오류' };
    } else {
      var url = `https://search.daum.net/search?w=tot&q=${encodeURI(
        coin + '시세',
      )}`;
      await page.goto(url);
      const imglist = await page.$$eval(
        '#jupCurrencyColl > div.coll_cont > div > div.wrap_quote > div.graph_quote > div.item_graph > ul > li:nth-child(1) > a > img',
        (v) => v.map((s) => s.getAttribute('src')),
      );
      return { ok: true, test: imglist };
    }
  }

  async getSuddenPT(name: string): Promise<DefaultRes> {
    const page = this.pages[0];

    try {
      if (name) {
        var url = `https://barracks.sa.nexon.com/api/Search/GetSearch/${encodeURI(
          name,
        )}/1`;
        const res = await axios.post(url).catch();

        if (res.data.result.characterInfo[0] == undefined) {
          return {
            ok: false,
            error: '잘못된 요청 ( 검색결과에 없는 이름입니다! )',
          };
        } else {
          var nid = res.data.result.characterInfo[0].user_nexon_sn;
          console.log(res.data);
          var sulr = `https://barracks.sa.nexon.com/${nid}/detail`;
          await page.goto(sulr);
          await page.waitForSelector(
            '#detail > div:nth-child(5) > div.grid.grid-1 > div.box.gd-5 > div.figures.list > ul > li:nth-child(3) > div.value',
          );
          let pth = await page.$eval(
            '#detail > div:nth-child(5) > div.grid.grid-1 > div.box.gd-5 > div.figures.list > ul > li:nth-child(3) > div.value > span:nth-child(1)',
            (v) => v.textContent,
          );
          let pth2 = await page.$eval(
            '#detail > div:nth-child(5) > div.grid.grid-1 > div.box.gd-5 > div.figures.list > ul > li:nth-child(3) > div.value > span:nth-child(1)',
            (v) => v.textContent,
          );
          let ptm = await page.$eval(
            '#detail > div:nth-child(5) > div.grid.grid-1 > div.box.gd-5 > div.figures.list > ul > li:nth-child(3) > div.value > span:nth-child(3)',
            (v) => v.textContent,
          );
          var resm = `${pth}시 ${ptm}분`;
          return { ok: true, playtime: resm };
        }
      } else {
        return { ok: false, error: '이름이 비었습니다!' };
      }
    } catch (error) {
      return { ok: false, error: '잘못된 요청' };
    }
  }

  async getSudden(name: string): Promise<DefaultRes> {
    const page = this.pages[1];

    try {
      if (name) {
        var url = `https://barracks.sa.nexon.com/api/Search/GetSearch/${encodeURI(
          name,
        )}/1`;
        const res = await axios.post(url).catch();

        if (res.data.result.characterInfo[0] == undefined) {
          return {
            ok: false,
            error: '잘못된 요청 ( 검색결과에 없는 이름입니다! )',
          };
          return;
        } else {
          console.log(res.data.result.characterInfo[0]);
          var nid = res.data.result.characterInfo[0].user_nexon_sn;
          var pimg = res.data.result.characterInfo[0].user_img;
          var sulr = `https://barracks.sa.nexon.com/${nid}/match`;
          var list;
          var onlined;
          var cland;
          await page.goto(sulr);
          await page.waitForSelector(
            '#user > div.summaries > ul:nth-child(2) > li:nth-child(2) > span.value.Rajdhani.text-white',
          );
          list = await page.$$('div.histories.grid-margin-top > div');

          const rate = await page.$eval(
            'span.value.Rajdhani.text-white',
            (v) => v.textContent,
          );
          try {
            await page
              .$eval('#user > div.picture.online', (v) => v)
              .catch((error) => {
                onlined = '오프라인';
              });
          } catch (error) {
            onlined = '오프라인';
          }
          if (onlined == undefined) {
            onlined = '온라인';
          }
          const name = await page
            .$eval('div.nickname.text-white', (v) => v.textContent)
            .catch((error) => {});
          const limg = await page
            .$eval('#user > div.rating > div.symbol >', (v) => v)
            .catch((error) => {});
          console.log(limg);
          var clan = await page
            .$eval(
              '#user > div.information > div.clan > a',
              (v) => v.textContent,
            )
            .catch((error) => {});
          cland = clan;
          if (cland == undefined) {
            cland = '없음';
          }
          const rep = await page.$eval(
            '#user > div.alarm.rrt > span > span',
            (v) => v.textContent,
          );
          const kb = await page.$eval(
            '#user > div.summaries > ul:nth-child(2) > li:nth-child(2) > span.value.Rajdhani.text-white',
            (v) => v.textContent,
          );
          const rank = await page.$eval(
            '#user > div.rating > div.total > div.value.Rajdhani.text-white',
            (v) => v.textContent,
          );
          let txt = '';
          let txted = '';
          var repox;
          if (rep.toString().includes('0001년 01월 01일')) {
            repox = 'X';
          } else {
            repox = 'O';
          }
          console.log(txt.toString().length);
          for (const node of list) {
            txt += `날짜 :${await node.$eval(
              'li.date.dotum',
              (v) => v.textContent,
            )}\n`;
            txt += `장소 : ${await node.$eval(
              'div.accordion > ul > li:nth-child(2)',
              (v) => v.textContent,
            )}\n`;
            txt += `대전 : ${await node.$eval(
              'div.accordion > ul > li:nth-child(3) > div > div',
              (v) => v.textContent,
            )}\n`;
            txt += `승패 : ${await node.$eval(
              'ul > li:nth-child(4) > div',
              (v) => v.textContent,
            )}\n`;
            txt += '\n';
          }
          if (txt.toString().length > 0) {
            return {
              ok: true,
              info: txt,
              surl: sulr,
              pimg: pimg,
              online: onlined,
              clan: cland,
              nexon_id: nid,
              name: name,
              rate: rate,
              kb: kb,
              rank: rank,
              rep: repox,
            };
          } else {
            return {
              ok: true,
              info: '( 기록없음 )',
              surl: sulr,
              pimg: pimg,
              online: onlined,
              clan: cland,
              rep: repox,
              nexon_id: nid,
              name: name,
              rate: rate,
              kb: kb,
              rank: rank,
            };
          }
        }
      } else {
        return { ok: false, error: '잘못된 요청 ( 이름 없음 )' };
      }
    } catch (error) {
      return { ok: false, error: '잘못된 요청' };
    }
  }
}
