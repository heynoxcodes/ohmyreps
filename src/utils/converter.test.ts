import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  parseProductUrl, 
  buildAgentUrl, 
  DEFAULT_AGENTS, 
  RAIDED_BLACKLIST_AGENTS, 
  isValidActiveAgent 
} from './agentConverter.ts';
import { parseSheetHtml, sanitizeSheetReferralUrl } from './sheetParser.ts';

test('parseProductUrl parses Oopbuy channel codes (0=1688, 1=taobao, 2/weidian=weidian) accurately', () => {
  const urlWeidian = 'https://oopbuy.com/product/weidian/7538826494?inviteCode=29TOTHGNH';
  const res1 = parseProductUrl(urlWeidian);
  assert.equal(res1.platform, 'weidian');
  assert.equal(res1.id, '7538826494');
  assert.equal(res1.rawStoreUrl, 'https://weidian.com/item.html?itemID=7538826494');

  const url1688 = 'https://oopbuy.com/product/0/988004378271?inviteCode=29TOTHGNH';
  const res2 = parseProductUrl(url1688);
  assert.equal(res2.platform, '1688');
  assert.equal(res2.id, '988004378271');
  assert.equal(res2.rawStoreUrl, 'https://detail.1688.com/offer/988004378271.html');

  const urlTaobao = 'https://oopbuy.com/product/1/1060798346197?inviteCode=29TOTHGNH';
  const res3 = parseProductUrl(urlTaobao);
  assert.equal(res3.platform, 'taobao');
  assert.equal(res3.id, '1060798346197');
  assert.equal(res3.rawStoreUrl, 'https://item.taobao.com/item.htm?id=1060798346197');
});

test('raided agents are excluded from active agents and present in blacklist', () => {
  const raidedIds = ['mulebuy', 'allchinabuy', 'cnfans', 'hoobuy', 'joyabuy'];
  for (const id of raidedIds) {
    assert.equal(isValidActiveAgent(id), false, `${id} should not be an active agent`);
    assert.ok(RAIDED_BLACKLIST_AGENTS.some(b => b.id === id), `${id} should be in RAIDED_BLACKLIST_AGENTS`);
  }

  assert.equal(DEFAULT_AGENTS[0].id, 'cnshopper');
  assert.equal(DEFAULT_AGENTS[0].defaultReferralCode, '2554628');
  assert.equal(DEFAULT_AGENTS[1].id, 'stargobuy');
  assert.equal(DEFAULT_AGENTS[1].defaultReferralCode, '10768');
});

test('buildAgentUrl generates exact working product + referral links across all 12 agents', () => {
  const taobaoOopUrl = 'https://oopbuy.com/product/1/1060798346197?inviteCode=29TOTHGNH';
  assert.equal(
    buildAgentUrl(taobaoOopUrl, 'cnshopper'),
    'https://cnshopper.com/goods/detail?keyword=1060798346197&platform=taobao&invite_id=2554628'
  );
  assert.equal(
    buildAgentUrl(taobaoOopUrl, 'oopbuy'),
    'https://oopbuy.com/product/1/1060798346197?inviteCode=4MPOITBZV'
  );

  const ali1688OopUrl = 'https://oopbuy.com/product/0/988004378271?inviteCode=29TOTHGNH';
  assert.equal(
    buildAgentUrl(ali1688OopUrl, 'cnshopper'),
    'https://cnshopper.com/goods/detail?keyword=988004378271&platform=1688&invite_id=2554628'
  );
  assert.equal(
    buildAgentUrl(ali1688OopUrl, 'oopbuy'),
    'https://oopbuy.com/product/0/988004378271?inviteCode=4MPOITBZV'
  );

  const inputUrl = 'https://weidian.com/item.html?itemID=7538826494';
  assert.equal(
    buildAgentUrl(inputUrl, 'cnshopper'),
    'https://cnshopper.com/goods/detail?keyword=7538826494&platform=weidian&invite_id=2554628'
  );
  assert.equal(
    buildAgentUrl(inputUrl, 'stargobuy'),
    'https://stargobuy.com/product/weidian/7538826494?invite_id=10768'
  );
  assert.equal(
    buildAgentUrl(inputUrl, 'oopbuy'),
    'https://oopbuy.com/product/weidian/7538826494?inviteCode=4MPOITBZV'
  );
  assert.ok(buildAgentUrl(inputUrl, 'superbuy').includes('partnercode=ENOQZo'));
  assert.ok(buildAgentUrl(inputUrl, 'lovegobuy').includes('invite_code=KSPMEY'));
  assert.ok(buildAgentUrl(inputUrl, 'sugargoo').includes('memberId=3161295250700719145'));
  assert.ok(buildAgentUrl(inputUrl, 'boonbuy').includes('inviteCode=PQNPT7D42'));
  assert.ok(buildAgentUrl(inputUrl, 'hipobuy').includes('inviteCode=WIIX4MNYG'));
  assert.ok(buildAgentUrl(inputUrl, 'litbuy').includes('inviteCode=KY6TU3BGB'));
  assert.ok(buildAgentUrl(inputUrl, 'gtbuy').includes('inviteCode=5S4W9BL4K'));
  assert.ok(buildAgentUrl(inputUrl, 'lolobuy').includes('inviteCode=3w5ja'));
  assert.ok(buildAgentUrl(inputUrl, 'rizzitgo').includes('rno=199196'));
});

test('sanitizeSheetReferralUrl and parseSheetHtml replace original sheet creator code 29TOTHGNH with 4MPOITBZV', () => {
  const dirty = 'https://oopbuy.com/product/weidian/7538826494?inviteCode=29TOTHGNH';
  assert.equal(sanitizeSheetReferralUrl(dirty), 'https://oopbuy.com/product/weidian/7538826494?inviteCode=4MPOITBZV');

  const sampleHtml = `
    <table>
      <tr>
        <td>Nike Tech Fleece Jacket</td>
        <td><img src="https://example.com/tech.jpg" /></td>
        <td>Husky</td>
        <td>$42</td>
        <td><a href="https://oopbuy.com/product/weidian/99887766?inviteCode=29TOTHGNH">Buy</a></td>
        <td><a href="https://uufinds.com/qc/123">QC Pics</a></td>
      </tr>
    </table>
  `;
  const items = parseSheetHtml(sampleHtml, 'Clothes');
  assert.equal(items.length, 1);
  assert.ok(items[0].buyLinks[0].url.includes('inviteCode=4MPOITBZV'));
  assert.ok(!items[0].buyLinks[0].url.includes('29TOTHGNH'));
});
