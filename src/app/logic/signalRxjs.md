
Angular RxJS and Signals: Better Together - Deborah kurate, Google Developer Expert

todo.service.ts

// Services 
private http = inject(HttpClient);
private userService = inject(UserService);

// Initial State
private state = signal<ToDoState>({
    isLoading: false,
    currentMember: undefined,
    memberToDos: [],
    error: null,
});

// Selectors
isLoading = computed(() => this.state().isLoading);
currentMember = computed(() => this.state().currentMember);
errorMessage = computd(() => this.state().error)

private selectedIdSubject = new Subject<number>();
constructor() {
    this.seletedIdSubject.pipe(
        tap(() => this.setLoadingIndicator(true)),
        tap(id => this.setCurrentMember(id)),
        switchMap(id => this.getToDos(id)),
        delay(1000),
        takeUntilDestroyed()
    ).subscribe(todos => this.setMemberToDos(todos));
}

private setLoadingIndicator(isLoading: boolean) {
    this.state.update(state => ({
        ...state,
        isLoading: isLoading
    }))
}
private setCurrentMemeber(id: number) {
    const member = this.userService.getCurrentMember(id);
    this.state.update(state => ({
        ...state,
        currentMember: member,
        memberToDos: []
    }))
}

private getToDos(id: number): Observable<ToDo[]> {
    return this.http.get<ToDo[]>(url).pipe(
        map(data => data.map(t => 
          t.title.lenght > 20 ? ({...t, title: t.title.substring(0, 20)}) : t
        )),
        catchError(err => this.setError(err))
    )
}

private setMemberToDos(todos: ToDo[]): void {
    this.state.update(state => ({
        ...state,
        memberToDos: todos,
        isLoading: false
    }))
}
private setError(err: HttpErrorResponse): Observable<Todo[]> {
    this.state.update(state => ({
        ...state,
        error: setErrorMessage(err)
    }))
    return of([])
}

getToDosForMember(memberId: number) {
    this.selectedIdSubject.next(memberId);
}
// interface ToDo
export interface Todo {

}

export interface ToDoState {
    isLoading: boolean;
    currentMember: User | undefined;
    memberToDos: ToDo[];
    error: string | null;
}

// This should be somewhere reusable
export function setErrorMessage(err: HttpErrorResponse): string {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
        // A client-side or network error occured. Handle it accordingly.
        errorMessage = 'An error occurered: ${err.error.message}';
    } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        errorMessage: `Backend returned code ${err.status}: ${err.message}`;
    }
    console.error(err);
    return errorMessage;
}

app.component

// services
userService = inject()
todoService = injec()
//Signals
users = this.userService.members;
isLoading = this.todoService.isLoading;
todosForMember = this.todoService.toDos;
errorMessage = this.todoService.errorMessage;

// Actions

onSelected(ele: EventTarget | null) {
    this.todoService.getToDosForMember(Number((ele as HTMLSelectElement).value));
}

