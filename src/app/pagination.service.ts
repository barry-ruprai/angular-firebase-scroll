import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { QueryConfig } from './query-config';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { scan, take, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  private _done = new BehaviorSubject(false);
  private _loading = new BehaviorSubject(false);
  private _data = new BehaviorSubject([]);

  private query: QueryConfig;

  data: Observable<any>;
  done: Observable<boolean> = this._done.asObservable();
  loading: Observable<boolean> = this._loading.asObservable();

  constructor(private afs: AngularFirestore) {}

  init(path: string, field: string, opts?: any) {
    this.query = {
      path,
      field,
      limit: 2,
      reverse: false,
      prepend: false,
      ...opts
    };

    const first = this.afs.collection(this.query.path, ref => {
      return ref
        .orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
        .limit(this.query.limit);
    });

    this.mapAndUpdate(first);

    this.data = this._data.asObservable().pipe(
      scan((acc, val) => {
        return this.query.prepend ? val.concat(acc) : acc.concat(val);
      })
    );
  }

  private mapAndUpdate(col: AngularFirestoreCollection) {
    if (this._done.value || this._loading.value) {
      return;
    }

    this._loading.next(true);
    return col
      .snapshotChanges()
      .pipe(
        tap(arr => {
          let values = arr.map(snap => {
            const data = snap.payload.doc.data();
            const doc = snap.payload.doc;
            return { ...data, doc };
          });
          values = this.query.prepend ? values.reverse() : values;
          // update source with new values, loading done
          this._data.next(values);
          this._loading.next(false);
          // no more values, mark done
          if (!values.length) {
            this._done.next(true);
          }
        }),
        take(1)
      )
      .subscribe();
  }

  // Determines the doc snapshot to paginate the query
  private getCursor() {
    const current = this._data.value;
    if (current.length) {
      return this.query.prepend
        ? current[0].doc
        : current[current.length - 1].doc;
    }
    return null;
  }

  more() {
    const cursor = this.getCursor();
    const more = this.afs.collection(this.query.path, ref => {
      return ref
        .orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
        .limit(this.query.limit)
        .startAfter(cursor);
    });
    this.mapAndUpdate(more);
  }
}
