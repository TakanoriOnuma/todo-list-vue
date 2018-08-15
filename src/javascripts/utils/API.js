import request from 'superagent';

// APIメソッド
import { GET, POST, PUT, DELETE } from '../constants/API';

// APIステータス
import {
  API_STATUS_REQUESTING,
  API_STATUS_SUCCESS,
  API_STATUS_CANCEL,
  API_STATUS_ERROR
} from '../constants/API';

/**
 * リクエストするアクションを作る
 * @param {Object} options
 * @param {string} options.method - メソッド名
 * @param {string} options.endpoint - エンドポイント
 * @param {Object} options.headers - ヘッダー情報
 * @param {Object?} options.query - クエリ
 * @param {string} options.updateMutationName - 更新するときに送るMutation名
 * @param {Object?} options.actionParams - mutationにcommitするときに送るパラメータ
 * @param {number?} options.timeout - 通信のタイムアウト
 * @return {function} - commitを引数とした関数を返し、この関数はCancellable Promiseを返す
 */
export function createAPIAction(options) {
  const {
    method,
    endpoint,
    headers = {},
    query = {},
    actionParams = {},
    updateMutationName,
    timeout = 15000
  } = options;

  return (commit) => {
    let cancel = null;  // Promise内で設定するcancel関数をpromiseのpropertyにつけるため仕方なく上の階層で宣言する
    const promise = new Promise((resolve, reject) => {
      let isCancellable = true;
      // リクエスト開始を通知する
      commit(updateMutationName, {
        status: API_STATUS_REQUESTING,
        actionParams
      });

      // リクエストの生成
      const req = request(method, endpoint).set(headers);
      req.timeout(timeout);
      switch (method) {
        case GET:
          req.query(query);
          break;
        case POST:
        case PUT:
        case DELETE:
          req.send(query);
          break;
        default:
          // do nothing
      }

      // リクエスト結果のハンドリング
      req.end((err, res) => {
        isCancellable = false;

        // リクエストに失敗したとき
        if (err) {
          commit(updateMutationName, {
            status: API_STATUS_ERROR,
            response: err,
            actionParams
          });

          reject({
            isCancel: false,
            err
          });
          return;
        }

        // リクエストに成功したとき
        commit(updateMutationName, {
          status: API_STATUS_SUCCESS,
          response: res,
          actionParams
        });
        resolve(res);
      });

      // キャンセル関数をセットする
      cancel = () => {
        if (!isCancellable) {
          return;
        }

        req.abort();

        commit(updateMutationName, {
          status: API_STATUS_CANCEL,
          actionParams
        });
        reject({
          isCancel: true,
          response: null
        });
      };
    });
    // cancel出来るようにPromiseのプロパティにくっつける
    promise.cancel = cancel;

    return promise;
  };
}
