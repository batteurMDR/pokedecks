import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime, pluck } from 'rxjs/operators';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
    private _subscriptions = new Subscription();
    private _lastUrl = null;

    public searchForm = new FormGroup({
        search: new FormControl(''),
    });

    constructor(private _router: Router, private _route: ActivatedRoute) {}

    ngOnInit(): void {
        this._subscriptions.add(
            this.searchForm.valueChanges.pipe(debounceTime(500), pluck('search')).subscribe((search) => {
                if (search === '') {
                    this._router.navigateByUrl(this._lastUrl);
                    this._lastUrl = null;
                } else {
                    if (!this._lastUrl) {
                        this._lastUrl = this._route.snapshot['_routerState'].url;
                    }
                    this._router.navigate(['/pokemons/search'], { queryParams: { search } });
                }
            })
        );
        this._subscriptions.add(
            this._route.queryParams.pipe(pluck('search')).subscribe((search) => {
                if (search && this.searchForm.get('search').value === '') {
                    this.searchForm.patchValue({ search });
                }
            })
        );
    }

    ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
    }
}
