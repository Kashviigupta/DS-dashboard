/* Experiment content: concepts, algorithm steps, complexity, full C programs, viva questions. */
const R=String.raw;
const EXPS=[
/* ------------------------------------------------------------------ 1 */
{id:'e1',no:1,short:'Arrays, Structures, Pointers',cat:'Linear',cx:'Access O(1) · Insert/Delete O(n)',
 title:'Arrays, Array of Structures and Pointers',
 aim:'Demonstrate how arrays are laid out in contiguous memory, how an array of structures groups related fields, and how pointers and pointer arithmetic reach the same data.',
 concepts:[
  {h:'Array: contiguous memory',p:'An array stores elements of one type side by side. The address of <code>a[i]</code> is <code>base + i × sizeof(type)</code>, which is why access by index is O(1).'},
  {h:'Insert and delete shift elements',p:'Inserting at position <code>pos</code> moves every later element one place right. Deleting moves them left. That makes both O(n) in the worst case.'},
  {h:'Array of structures',p:'A <code>struct</code> bundles fields of different types. An array of structs stores records back to back, each of <code>sizeof(struct)</code> bytes (padding may be added by the compiler).'},
  {h:'Pointers and arithmetic',p:'A pointer holds an address. <code>p + 1</code> moves by one element, not one byte. For an array, <code>a[i]</code> is the same as <code>*(a + i)</code>. For a struct pointer, use <code>sp-&gt;field</code>.'}],
 lab:'Memory visualizer',
 steps:['Declare an array, read <b>n</b> elements and print each value with its address.','To <b>insert</b>, check overflow, shift elements right from the end up to <b>pos</b>, store the value, increase n.','To <b>delete</b>, check underflow, shift elements left from <b>pos+1</b>, decrease n.','Declare <b>struct Student s[5]</b>, read the fields and print them using a pointer <b>sp</b> walking from <b>s</b> to <b>s+n</b>.','Show <b>p</b>, <b>*p</b>, <b>&amp;x</b> and a double pointer <b>**pp</b>, and change x through each.'],
 cplx:[['Access a[i]','O(1)','Direct address calculation'],['Search (unsorted)','O(n)','Scan every element'],['Insert at position','O(n)','Shift right'],['Delete at position','O(n)','Shift left'],['Pointer dereference','O(1)','One memory read']],
 code:[{label:'exp1.c',src:R`#include <stdio.h>

#define MAX 10

struct Student {
    int   roll;
    char  name[20];
    float marks;
};

void arrayOperations(void) {
    int a[MAX], n, i, pos, val, ch;
    int *p;

    printf("How many elements (max %d)? ", MAX);
    scanf("%d", &n);
    printf("Enter %d elements: ", n);
    for (i = 0; i < n; i++)
        scanf("%d", &a[i]);

    do {
        printf("\n1.Insert  2.Delete  3.Display using pointer  4.Back : ");
        scanf("%d", &ch);
        switch (ch) {
        case 1:
            if (n == MAX) { printf("Array is full (overflow)\n"); break; }
            printf("Enter position (0-%d) and value: ", n);
            scanf("%d %d", &pos, &val);
            if (pos < 0 || pos > n) { printf("Invalid position\n"); break; }
            for (i = n; i > pos; i--)          /* shift right */
                a[i] = a[i - 1];
            a[pos] = val;
            n++;
            break;
        case 2:
            if (n == 0) { printf("Array is empty (underflow)\n"); break; }
            printf("Enter position to delete (0-%d): ", n - 1);
            scanf("%d", &pos);
            if (pos < 0 || pos >= n) { printf("Invalid position\n"); break; }
            for (i = pos; i < n - 1; i++)      /* shift left */
                a[i] = a[i + 1];
            n--;
            break;
        case 3:
            p = a;                             /* p points to a[0] */
            for (i = 0; i < n; i++)
                printf("a[%d] = %d   address %p   *(p+%d) = %d\n",
                       i, a[i], (void *)(p + i), i, *(p + i));
            break;
        }
    } while (ch != 4);
}

void structureOperations(void) {
    struct Student s[5], *sp;
    int n, i;

    printf("How many students (max 5)? ");
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        printf("Roll, name, marks of student %d: ", i + 1);
        scanf("%d %19s %f", &s[i].roll, s[i].name, &s[i].marks);
    }
    printf("\nRoll  Name         Marks\n");
    for (sp = s; sp < s + n; sp++)             /* pointer walks the array */
        printf("%-5d %-12s %.2f\n", sp->roll, sp->name, sp->marks);
    printf("sizeof(struct Student) = %zu bytes\n", sizeof(struct Student));
}

void pointerDemo(void) {
    int x = 10, y = 99;
    int *p = &x;
    int **pp = &p;

    printf("x = %d      &x  = %p\n", x, (void *)&x);
    printf("p = %p   *p  = %d\n", (void *)p, *p);
    printf("pp = %p  **pp = %d\n", (void *)pp, **pp);

    *p = 25;                                   /* changes x */
    printf("After *p = 25  : x = %d\n", x);
    **pp = 40;                                 /* also changes x */
    printf("After **pp = 40: x = %d\n", x);

    p = &y;                                    /* p now points to y */
    printf("After p = &y   : *p = %d\n", *p);
}

int main(void) {
    int ch;
    do {
        printf("\n===== EXPERIMENT 1 =====\n");
        printf("1. Array operations\n2. Array of structures\n3. Pointers\n4. Exit\nChoice: ");
        scanf("%d", &ch);
        switch (ch) {
        case 1: arrayOperations();     break;
        case 2: structureOperations(); break;
        case 3: pointerDemo();         break;
        }
    } while (ch != 4);
    return 0;
}
`}],
 viva:[['What is the difference between a[i] and *(a+i)?','There is none. The compiler converts a[i] into *(a + i). Pointer arithmetic scales by the element size.'],['Why is insertion in an array O(n)?','Elements after the insert position must be shifted by one place to make room, and in the worst case (insert at index 0) that is every element.'],['What does sizeof(struct) return and why can it exceed the sum of its fields?','It returns the total bytes including padding. The compiler aligns fields to their natural boundaries, so gaps may be added.'],['Difference between . and -> operators?','The dot accesses a field of a structure variable. The arrow accesses a field through a pointer to a structure: sp->x is (*sp).x.'],['What is a double pointer?','A pointer that stores the address of another pointer. **pp gives the value of the variable that p points to.']]},

/* ------------------------------------------------------------------ 2 */
{id:'e2',no:2,short:'Singly Linked List',cat:'Linear',cx:'Insert at head O(1) · Search O(n)',
 title:'Singly Linked List using Structures and Pointers',
 aim:'Build a singly linked list with dynamically allocated nodes and implement insertion, deletion, searching, traversal and reversal.',
 concepts:[
  {h:'Node = data + next',p:'Each node is a <code>struct</code> with a data field and a pointer to the next node. The last node points to <code>NULL</code>. A <code>head</code> pointer keeps the list reachable.'},
  {h:'Dynamic allocation',p:'Nodes are created with <code>malloc</code> when needed and released with <code>free</code>. The list grows and shrinks at run time with no shifting of data.'},
  {h:'Pointer rewiring',p:'Insertion and deletion only change a few <code>next</code> pointers. Order matters: link the new node to the rest first, then link the previous node to the new node.'},
  {h:'Costs',p:'Insert or delete at the head is O(1). Reaching the end or the k-th node needs a walk from the head, so end operations and search are O(n). Memory is not contiguous, so there is no random access.'}],
 lab:'Linked list visualizer',
 steps:['Create a node: <b>malloc</b>, store data, set <b>next = NULL</b>.','<b>Insert at beginning</b>: <b>n-&gt;next = head; head = n;</b>','<b>Insert at end</b>: walk to the last node, then <b>last-&gt;next = n;</b>','<b>Insert at position</b>: walk to node pos-1, then <b>n-&gt;next = t-&gt;next; t-&gt;next = n;</b>','<b>Delete</b>: keep a pointer to the previous node, bypass the target with <b>prev-&gt;next = t-&gt;next</b>, then <b>free(t)</b>.','<b>Reverse</b>: walk once with three pointers (prev, curr, next) flipping each link.'],
 cplx:[['Insert at head','O(1)','Two pointer updates'],['Insert at tail','O(n)','Walk to the end (O(1) with a tail pointer)'],['Delete at head','O(1)','Move head forward'],['Delete by value / search','O(n)','Linear scan'],['Reverse','O(n)','One pass, O(1) extra space']],
 code:[{label:'exp2.c',src:R`#include <stdio.h>
#include <stdlib.h>

struct node {
    int data;
    struct node *next;
};

struct node *head = NULL;

struct node *createNode(int x) {
    struct node *n = (struct node *)malloc(sizeof(struct node));
    if (n == NULL) { printf("Memory allocation failed\n"); exit(1); }
    n->data = x;
    n->next = NULL;
    return n;
}

void insertBegin(int x) {
    struct node *n = createNode(x);
    n->next = head;
    head = n;
}

void insertEnd(int x) {
    struct node *n = createNode(x), *t = head;
    if (head == NULL) { head = n; return; }
    while (t->next != NULL)
        t = t->next;
    t->next = n;
}

void insertPos(int x, int pos) {                 /* positions start at 1 */
    struct node *n, *t = head;
    int i;
    if (pos < 1) { printf("Invalid position\n"); return; }
    if (pos == 1) { insertBegin(x); return; }
    for (i = 1; i < pos - 1 && t != NULL; i++)
        t = t->next;
    if (t == NULL) { printf("Position out of range\n"); return; }
    n = createNode(x);
    n->next = t->next;
    t->next = n;
}

void deleteBegin(void) {
    struct node *t = head;
    if (head == NULL) { printf("List is empty\n"); return; }
    head = head->next;
    printf("Deleted %d\n", t->data);
    free(t);
}

void deleteEnd(void) {
    struct node *t = head, *prev = NULL;
    if (head == NULL) { printf("List is empty\n"); return; }
    if (head->next == NULL) { printf("Deleted %d\n", head->data); free(head); head = NULL; return; }
    while (t->next != NULL) { prev = t; t = t->next; }
    prev->next = NULL;
    printf("Deleted %d\n", t->data);
    free(t);
}

void deleteValue(int x) {
    struct node *t = head, *prev = NULL;
    while (t != NULL && t->data != x) { prev = t; t = t->next; }
    if (t == NULL) { printf("%d not found\n", x); return; }
    if (prev == NULL) head = t->next;
    else              prev->next = t->next;
    free(t);
    printf("Deleted %d\n", x);
}

int search(int x) {
    struct node *t = head;
    int pos = 1;
    while (t != NULL) {
        if (t->data == x) return pos;
        t = t->next;
        pos++;
    }
    return 0;
}

void reverse(void) {
    struct node *prev = NULL, *curr = head, *next;
    while (curr != NULL) {
        next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    head = prev;
}

void display(void) {
    struct node *t = head;
    if (head == NULL) { printf("List is empty\n"); return; }
    while (t != NULL) {
        printf("%d -> ", t->data);
        t = t->next;
    }
    printf("NULL\n");
}

int main(void) {
    int ch, x, pos;
    do {
        printf("\n1.Insert begin 2.Insert end 3.Insert at pos 4.Delete begin\n");
        printf("5.Delete end 6.Delete value 7.Search 8.Reverse 9.Display 0.Exit\nChoice: ");
        scanf("%d", &ch);
        switch (ch) {
        case 1: printf("Value: ");           scanf("%d", &x);          insertBegin(x);   break;
        case 2: printf("Value: ");           scanf("%d", &x);          insertEnd(x);     break;
        case 3: printf("Value, position: "); scanf("%d %d", &x, &pos); insertPos(x, pos); break;
        case 4: deleteBegin(); break;
        case 5: deleteEnd();   break;
        case 6: printf("Value: "); scanf("%d", &x); deleteValue(x); break;
        case 7: printf("Value: "); scanf("%d", &x);
                pos = search(x);
                if (pos) printf("Found at position %d\n", pos);
                else     printf("Not found\n");
                break;
        case 8: reverse();  break;
        case 9: display();  break;
        }
    } while (ch != 0);
    return 0;
}
`}],
 viva:[['Why is a linked list preferred over an array when insertions are frequent?','Insertion needs only pointer changes, with no shifting. At the head it is O(1). An array needs O(n) shifts.'],['What happens if you free a node before updating the previous node\'s next?','The previous node keeps a dangling pointer to freed memory. Always relink first and free last.'],['How do you detect the last node?','Its next pointer is NULL.'],['What is the time to insert at the end and how can it be improved?','O(n) because you walk to the end. Keep a tail pointer to make it O(1).'],['Why is binary search not practical on a linked list?','There is no random access. Reaching the middle node takes O(n), so the O(log n) advantage is lost.']]},

/* ------------------------------------------------------------------ 3 */
{id:'e3',no:3,short:'Stack and Infix to Postfix',cat:'Linear',cx:'Push/Pop O(1) · Conversion O(n)',
 title:'Stack using SLL and Infix to Postfix Conversion',
 aim:'(a) Implement a stack with a singly linked list: create, push, pop and display the top. (b) Use that stack to convert an infix expression to postfix.',
 concepts:[
  {h:'LIFO behaviour',p:'A stack removes the most recently added element first. Only the top is accessible. Operations are push, pop, peek and isEmpty.'},
  {h:'Stack on a singly linked list',p:'Treat the head of the list as the top. Push is insert-at-head and pop is delete-at-head, both O(1). There is no fixed capacity, so overflow only happens if <code>malloc</code> fails. Underflow occurs when <code>top == NULL</code>.'},
  {h:'Infix vs postfix',p:'Infix writes the operator between operands (<code>A+B</code>). Postfix writes it after (<code>AB+</code>). Postfix needs no parentheses and no precedence rules once produced, which makes evaluation simple.'},
  {h:'Conversion rules',p:'Operands go straight to the output. <code>(</code> is pushed. <code>)</code> pops to the matching <code>(</code>. An operator pops every stacked operator of higher precedence, or equal precedence if it is left-associative, then is pushed. <code>^</code> is right-associative.'}],
 lab:'Stack and conversion visualizer',
 steps:['<b>Create</b> stack: <b>top = NULL</b>.','<b>Push</b>: allocate node, <b>n-&gt;next = top; top = n;</b>','<b>Pop</b>: if top is NULL report underflow, else save top, move <b>top = top-&gt;next</b>, free the old node.','<b>Display top</b>: print <b>top-&gt;data</b> without removing it.','<b>Infix to postfix</b>: scan left to right applying the conversion rules.','After the scan, <b>pop everything</b> left in the stack to the output.'],
 cplx:[['Push','O(1)','Insert at head'],['Pop','O(1)','Delete at head'],['Peek','O(1)','Read top->data'],['Infix to postfix','O(n)','Each symbol pushed and popped at most once'],['Space','O(n)','Stack depth grows with nesting']],
 code:[{label:'exp3.c',src:R`#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>

struct node {
    int data;
    struct node *next;
};

struct node *top = NULL;                /* head of the SLL is the top of the stack */

void push(int x) {
    struct node *n = (struct node *)malloc(sizeof(struct node));
    if (n == NULL) { printf("Stack overflow (no memory)\n"); return; }
    n->data = x;
    n->next = top;
    top = n;
}

int pop(void) {
    struct node *t;
    int x;
    if (top == NULL) { printf("Stack underflow\n"); return -1; }
    t = top;
    x = t->data;
    top = top->next;
    free(t);
    return x;
}

void peek(void) {
    if (top == NULL) printf("Stack is empty\n");
    else             printf("Top element = %d\n", top->data);
}

void display(void) {
    struct node *t = top;
    if (top == NULL) { printf("Stack is empty\n"); return; }
    printf("TOP -> ");
    while (t != NULL) { printf("%d ", t->data); t = t->next; }
    printf("<- BOTTOM\n");
}

/* ---------- part (b): infix to postfix ---------- */
int prec(char c) {
    if (c == '^') return 3;
    if (c == '*' || c == '/') return 2;
    if (c == '+' || c == '-') return 1;
    return 0;
}

int infixToPostfix(const char in[], char out[]) {
    int i, k = 0;
    char c;
    while (top != NULL) pop();          /* start with an empty stack */

    for (i = 0; in[i] != '\0'; i++) {
        c = in[i];
        if (isspace((unsigned char)c)) continue;

        if (isalnum((unsigned char)c)) {
            out[k++] = c;                               /* operand */
        } else if (c == '(') {
            push(c);
        } else if (c == ')') {
            while (top != NULL && top->data != '(')
                out[k++] = (char)pop();
            if (top == NULL) { printf("Mismatched parentheses\n"); return 0; }
            pop();                                      /* discard '(' */
        } else {                                        /* operator */
            while (top != NULL && top->data != '(' &&
                   (prec(top->data) > prec(c) ||
                   (prec(top->data) == prec(c) && c != '^')))
                out[k++] = (char)pop();
            push(c);
        }
    }
    while (top != NULL) {
        if (top->data == '(') { printf("Mismatched parentheses\n"); return 0; }
        out[k++] = (char)pop();
    }
    out[k] = '\0';
    return 1;
}

int main(void) {
    int ch, x;
    char infix[100], postfix[100];
    do {
        printf("\n1.Push 2.Pop 3.Display top 4.Display stack 5.Infix to postfix 0.Exit\nChoice: ");
        scanf("%d", &ch);
        switch (ch) {
        case 1: printf("Value: "); scanf("%d", &x); push(x); break;
        case 2: x = pop(); if (x != -1) printf("Popped %d\n", x); break;
        case 3: peek();    break;
        case 4: display(); break;
        case 5: printf("Enter infix expression (no spaces): ");
                scanf("%99s", infix);
                if (infixToPostfix(infix, postfix))
                    printf("Postfix: %s\n", postfix);
                break;
        }
    } while (ch != 0);
    return 0;
}
`}],
 viva:[['Why is the head of the list used as the top of the stack?','Insert and delete at the head are O(1) and need no traversal. Using the tail would make pop O(n) in a singly linked list.'],['Name three applications of a stack.','Function call management, undo operations, expression evaluation and conversion, balanced bracket checking, depth-first search.'],['Why does ^ use a different rule from + and *?','It is right-associative: A^B^C means A^(B^C). So an incoming ^ must not pop an equal-precedence ^ from the stack.'],['What is the postfix form of A+B*C?','ABC*+ because * has higher precedence and stays on the stack until the end.'],['What error indicates unbalanced parentheses during conversion?','A closing bracket with no opening bracket on the stack, or an opening bracket still on the stack after the scan.']]},

/* ------------------------------------------------------------------ 4 */
{id:'e4',no:4,short:'Static Queue',cat:'Linear',cx:'Enqueue/Dequeue O(1)',
 title:'Static Implementation of a Queue',
 aim:'Implement a queue with a fixed-size array using front and rear indices, first as a linear queue and then as a circular queue that reuses freed space.',
 concepts:[
  {h:'FIFO behaviour',p:'A queue removes the oldest element first. Elements are added at the <b>rear</b> and removed from the <b>front</b>. Operations: enqueue, dequeue, peek, display.'},
  {h:'Static means fixed capacity',p:'The array size <code>MAX</code> is chosen at compile time. Enqueue on a full queue is <b>overflow</b>. Dequeue on an empty queue is <b>underflow</b>.'},
  {h:'The linear queue problem',p:'After dequeues, the front moves forward and the slots behind it are never reused. The queue can report overflow (<code>rear == MAX-1</code>) while the array still has free cells.'},
  {h:'Circular queue',p:'Indices wrap around using <code>(index + 1) % MAX</code>. Freed slots are reused, so the full capacity is available. It is full when every slot is occupied and empty when no slot is.'}],
 lab:'Queue visualizer',
 steps:['Initialise <b>front = rear = -1</b> and a fixed array <b>q[MAX]</b>.','<b>Enqueue</b>: check overflow, set front to 0 on the first insert, advance rear, store the value.','<b>Dequeue</b>: check underflow, read q[front], advance front, reset both to -1 when the queue becomes empty.','<b>Circular version</b>: advance with <b>(i+1) % MAX</b> and test overflow with <b>(rear+1)%MAX == front</b>.','<b>Display</b>: print from front to rear (wrapping in the circular case).'],
 cplx:[['Enqueue','O(1)','Index update and one store'],['Dequeue','O(1)','Index update'],['Peek','O(1)','Read q[front]'],['Display','O(n)','Visit each element'],['Space','O(MAX)','Fixed array']],
 code:[
 {label:'linear queue',src:R`#include <stdio.h>
#define MAX 5

int q[MAX];
int front = -1, rear = -1;

void enqueue(int x) {
    if (rear == MAX - 1) {
        printf("Queue overflow\n");
        return;
    }
    if (front == -1) front = 0;
    q[++rear] = x;
}

void dequeue(void) {
    if (front == -1) {
        printf("Queue underflow\n");
        return;
    }
    printf("Deleted %d\n", q[front++]);
    if (front > rear)                 /* queue became empty: reset */
        front = rear = -1;
}

void peek(void) {
    if (front == -1) printf("Queue is empty\n");
    else             printf("Front element = %d\n", q[front]);
}

void display(void) {
    int i;
    if (front == -1) { printf("Queue is empty\n"); return; }
    printf("Front -> ");
    for (i = front; i <= rear; i++)
        printf("%d ", q[i]);
    printf("<- Rear\n");
}

int main(void) {
    int ch, x;
    do {
        printf("\n1.Enqueue 2.Dequeue 3.Peek 4.Display 0.Exit\nChoice: ");
        scanf("%d", &ch);
        switch (ch) {
        case 1: printf("Value: "); scanf("%d", &x); enqueue(x); break;
        case 2: dequeue(); break;
        case 3: peek();    break;
        case 4: display(); break;
        }
    } while (ch != 0);
    return 0;
}
`},
 {label:'circular queue',src:R`#include <stdio.h>
#define MAX 5

int q[MAX];
int front = -1, rear = -1;

void enqueue(int x) {
    if ((rear + 1) % MAX == front) {          /* every slot is used */
        printf("Queue overflow\n");
        return;
    }
    if (front == -1) front = rear = 0;        /* first element */
    else             rear = (rear + 1) % MAX;
    q[rear] = x;
}

void dequeue(void) {
    if (front == -1) {
        printf("Queue underflow\n");
        return;
    }
    printf("Deleted %d\n", q[front]);
    if (front == rear) front = rear = -1;     /* last element removed */
    else               front = (front + 1) % MAX;
}

void display(void) {
    int i;
    if (front == -1) { printf("Queue is empty\n"); return; }
    printf("Front -> ");
    for (i = front; ; i = (i + 1) % MAX) {
        printf("%d ", q[i]);
        if (i == rear) break;
    }
    printf("<- Rear\n");
}

int main(void) {
    int ch, x;
    do {
        printf("\n1.Enqueue 2.Dequeue 3.Display 0.Exit\nChoice: ");
        scanf("%d", &ch);
        switch (ch) {
        case 1: printf("Value: "); scanf("%d", &x); enqueue(x); break;
        case 2: dequeue(); break;
        case 3: display(); break;
        }
    } while (ch != 0);
    return 0;
}
`}],
 viva:[['What is the drawback of a linear array queue?','Freed front slots are not reused, so overflow can occur while the array still has empty cells.'],['How does a circular queue fix it?','Indices wrap around with modulo MAX, so space released by dequeue is reused.'],['How do you tell full from empty in a circular queue?','Here empty means front == -1 and full means (rear+1)%MAX == front. Many implementations keep a count instead.'],['Name applications of a queue.','CPU scheduling, printer spooling, breadth-first search, buffering in I/O, call-centre systems.'],['What is the time complexity of enqueue and dequeue?','Both are O(1).']]},

/* ------------------------------------------------------------------ 5 */
{id:'e5',no:5,short:'Binary Search Tree (DLL nodes)',cat:'Non-linear',cx:'Avg O(log n) · Worst O(n)',
 title:'Dynamic Binary Search Tree using Doubly Linked List Nodes',
 aim:'Build a dynamic binary search tree whose nodes have the structure of a doubly linked list node (prev, data, next), and implement insert, search, delete and traversals.',
 concepts:[
  {h:'BST property',p:'For every node, all keys in the left subtree are smaller and all keys in the right subtree are larger. This allows searching by discarding half the remaining tree at each step when it is balanced.'},
  {h:'DLL node used as a tree node',p:'A doubly linked list node has <code>prev</code>, <code>data</code> and <code>next</code>. In the tree, <code>prev</code> serves as the <b>left child</b> pointer and <code>next</code> as the <b>right child</b> pointer. The same record shape, two different structures.'},
  {h:'Deletion cases',p:'A node with no child is removed directly. A node with one child is replaced by that child. A node with two children takes the value of its <b>inorder successor</b> (smallest key of the right subtree), which is then deleted.'},
  {h:'Traversals and the DLL view',p:'Inorder (left, root, right) visits keys in sorted order. Linking nodes in that order with <code>prev</code> and <code>next</code> flattens the tree into a sorted doubly linked list, shown in the visualizer.'}],
 lab:'BST visualizer',
 steps:['Define <b>struct node { struct node *prev; int data; struct node *next; }</b>.','<b>Insert</b>: go left if key &lt; node, right if greater, attach a new node at the first NULL link.','<b>Search</b>: same path as insert, stop when the key is found or a NULL link is reached.','<b>Delete</b>: handle leaf, one child and two children (use the inorder successor).','<b>Traverse</b>: inorder, preorder and postorder with recursion.','Compute <b>height</b> and <b>node count</b> to see how the shape affects cost.'],
 cplx:[['Insert / Search (balanced)','O(log n)','Height is log n'],['Insert / Search (skewed)','O(n)','Sorted input makes a chain'],['Delete','O(h)','h = tree height'],['Traversal','O(n)','Every node visited once'],['Space (recursion)','O(h)','Call stack depth']],
 code:[{label:'exp5.c',src:R`#include <stdio.h>
#include <stdlib.h>

/* A doubly linked list node used as a BST node:
   prev -> left child, next -> right child */
struct node {
    struct node *prev;
    int data;
    struct node *next;
};

struct node *root = NULL;

struct node *newNode(int x) {
    struct node *n = (struct node *)malloc(sizeof(struct node));
    if (n == NULL) { printf("Memory allocation failed\n"); exit(1); }
    n->data = x;
    n->prev = n->next = NULL;
    return n;
}

struct node *insert(struct node *r, int x) {
    if (r == NULL) return newNode(x);
    if (x < r->data)       r->prev = insert(r->prev, x);
    else if (x > r->data)  r->next = insert(r->next, x);
    else                   printf("%d already exists\n", x);
    return r;
}

struct node *search(struct node *r, int x) {
    while (r != NULL && r->data != x)
        r = (x < r->data) ? r->prev : r->next;
    return r;
}

struct node *findMin(struct node *r) {
    while (r->prev != NULL) r = r->prev;
    return r;
}

struct node *deleteNode(struct node *r, int x) {
    struct node *t;
    if (r == NULL) { printf("%d not found\n", x); return NULL; }
    if (x < r->data)       r->prev = deleteNode(r->prev, x);
    else if (x > r->data)  r->next = deleteNode(r->next, x);
    else {
        if (r->prev == NULL) {                 /* 0 or 1 child (right) */
            t = r->next; free(r); return t;
        }
        if (r->next == NULL) {                 /* 1 child (left) */
            t = r->prev; free(r); return t;
        }
        t = findMin(r->next);                  /* two children */
        r->data = t->data;
        r->next = deleteNode(r->next, t->data);
    }
    return r;
}

void inorder(struct node *r)   { if (r) { inorder(r->prev);  printf("%d ", r->data); inorder(r->next); } }
void preorder(struct node *r)  { if (r) { printf("%d ", r->data); preorder(r->prev); preorder(r->next); } }
void postorder(struct node *r) { if (r) { postorder(r->prev); postorder(r->next); printf("%d ", r->data); } }

int height(struct node *r) {
    int l, h;
    if (r == NULL) return 0;
    l = height(r->prev);
    h = height(r->next);
    return 1 + (l > h ? l : h);
}

int main(void) {
    int ch, x;
    do {
        printf("\n1.Insert 2.Delete 3.Search 4.Inorder 5.Preorder 6.Postorder 7.Height 0.Exit\nChoice: ");
        scanf("%d", &ch);
        switch (ch) {
        case 1: printf("Value: "); scanf("%d", &x); root = insert(root, x); break;
        case 2: printf("Value: "); scanf("%d", &x); root = deleteNode(root, x); break;
        case 3: printf("Value: "); scanf("%d", &x);
                printf(search(root, x) ? "Found\n" : "Not found\n"); break;
        case 4: inorder(root);   printf("\n"); break;
        case 5: preorder(root);  printf("\n"); break;
        case 6: postorder(root); printf("\n"); break;
        case 7: printf("Height = %d\n", height(root)); break;
        }
    } while (ch != 0);
    return 0;
}
`}],
 viva:[['Which traversal gives sorted output for a BST?','Inorder (left, root, right).'],['How does the tree node relate to a DLL node?','Both have two pointers and a data field. prev is used as the left child and next as the right child. The shape of the record is identical.'],['How is a node with two children deleted?','Copy the inorder successor (smallest key in the right subtree) into the node and delete the successor from the right subtree.'],['What is the worst case of search and when does it occur?','O(n). Inserting already sorted keys makes the tree a chain, so height equals n.'],['How can the skew problem be solved?','Use a self-balancing tree such as AVL or Red-Black tree.']]},

/* ------------------------------------------------------------------ 6 */
{id:'e6',no:6,short:'Graph Traversal',cat:'Non-linear',cx:'BFS/DFS O(V + E)',
 title:'Graph Traversal using Appropriate Data Structures',
 aim:'Traverse a graph breadth-first with a queue and depth-first with a stack, and see how each data structure shapes the order of visiting.',
 concepts:[
  {h:'Graph representation',p:'A graph has vertices and edges. An <b>adjacency matrix</b> uses a V×V table (O(V²) space, O(1) edge test). An <b>adjacency list</b> stores neighbours per vertex (O(V+E) space).'},
  {h:'BFS uses a queue',p:'Breadth-first search visits the start vertex, then all its neighbours, then their neighbours. The FIFO queue guarantees that vertices closer to the start are processed first, so BFS finds shortest paths in unweighted graphs.'},
  {h:'DFS uses a stack',p:'Depth-first search goes as deep as possible along one path before backing up. The LIFO stack (or recursion, which uses the call stack) remembers where to return to.'},
  {h:'Visited array',p:'A visited flag per vertex stops the search from cycling forever in graphs that contain cycles and ensures each vertex is processed once.'}],
 lab:'Graph traversal visualizer',
 steps:['Read the number of vertices and the <b>adjacency matrix</b>.','<b>BFS</b>: enqueue start and mark it visited. While the queue is not empty, dequeue u, print it, and enqueue every unvisited neighbour (marking it).','<b>DFS</b>: push start. While the stack is not empty, pop u, if unvisited mark and print it, then push its unvisited neighbours.','Repeat from every unvisited vertex if the graph may be <b>disconnected</b>.'],
 cplx:[['BFS (matrix)','O(V²)','Scan a full row per vertex'],['BFS (list)','O(V + E)','Each edge examined once'],['DFS (matrix)','O(V²)','Same scan cost'],['DFS (list)','O(V + E)','Each edge examined once'],['Extra space','O(V)','Queue or stack plus visited array']],
 code:[{label:'exp6.c',src:R`#include <stdio.h>

#define MAX 20

int adj[MAX][MAX];
int visited[MAX];
int n;

void clearVisited(void) {
    int i;
    for (i = 0; i < n; i++) visited[i] = 0;
}

/* Breadth first search using a queue */
void bfs(int start) {
    int queue[MAX], front = 0, rear = 0, u, v;
    clearVisited();
    queue[rear++] = start;
    visited[start] = 1;
    printf("BFS: ");
    while (front < rear) {
        u = queue[front++];                     /* dequeue */
        printf("%d ", u);
        for (v = 0; v < n; v++) {
            if (adj[u][v] && !visited[v]) {
                visited[v] = 1;
                queue[rear++] = v;              /* enqueue */
            }
        }
    }
    printf("\n");
}

/* Depth first search using an explicit stack */
void dfs(int start) {
    int stack[MAX * MAX], top = -1, u, v;
    clearVisited();
    stack[++top] = start;
    printf("DFS: ");
    while (top >= 0) {
        u = stack[top--];                       /* pop */
        if (visited[u]) continue;
        visited[u] = 1;
        printf("%d ", u);
        for (v = n - 1; v >= 0; v--)            /* push so the smallest pops first */
            if (adj[u][v] && !visited[v])
                stack[++top] = v;
    }
    printf("\n");
}

/* Depth first search using recursion (call stack) */
void dfsRec(int u) {
    int v;
    visited[u] = 1;
    printf("%d ", u);
    for (v = 0; v < n; v++)
        if (adj[u][v] && !visited[v])
            dfsRec(v);
}

int main(void) {
    int i, j, start, ch;
    printf("Number of vertices (max %d): ", MAX);
    scanf("%d", &n);
    printf("Enter the adjacency matrix (%d x %d):\n", n, n);
    for (i = 0; i < n; i++)
        for (j = 0; j < n; j++)
            scanf("%d", &adj[i][j]);

    do {
        printf("\n1.BFS 2.DFS (stack) 3.DFS (recursive) 0.Exit\nChoice: ");
        scanf("%d", &ch);
        if (ch >= 1 && ch <= 3) {
            printf("Start vertex: ");
            scanf("%d", &start);
        }
        switch (ch) {
        case 1: bfs(start); break;
        case 2: dfs(start); break;
        case 3: clearVisited(); printf("DFS: "); dfsRec(start); printf("\n"); break;
        }
    } while (ch != 0);
    return 0;
}
`}],
 viva:[['Which data structure does BFS use and why?','A queue. It processes vertices in the order they were discovered, so nearer vertices come first.'],['Which does DFS use?','A stack, either explicit or the recursion call stack.'],['Why do we need a visited array?','To avoid revisiting vertices and looping forever in cyclic graphs.'],['Time complexity of BFS with adjacency matrix?','O(V²), since each vertex scans a full row of V entries.'],['Give an application of BFS and one of DFS.','BFS: shortest path in an unweighted graph, level-order traversal. DFS: cycle detection, topological sorting, maze solving.']]},

/* ------------------------------------------------------------------ 7 */
{id:'e7',no:7,short:'Sorting and Searching',cat:'Algorithms',cx:'O(n²) basic · O(n log n) advanced',
 title:'Sorting and Searching Algorithms',
 aim:'Implement bubble, selection, insertion, merge and quick sort, then linear and binary search, and compare their behaviour and cost.',
 concepts:[
  {h:'Simple sorts, O(n²)',p:'<b>Bubble</b> swaps adjacent out-of-order pairs. <b>Selection</b> repeatedly picks the minimum and places it. <b>Insertion</b> grows a sorted prefix by inserting each new element. They are easy to write and fine for small inputs.'},
  {h:'Divide and conquer, O(n log n)',p:'<b>Merge sort</b> splits the array, sorts halves and merges them (stable, uses O(n) extra space). <b>Quick sort</b> partitions around a pivot and recurses (in place, O(n²) worst case with bad pivots).'},
  {h:'Linear search',p:'Check elements one by one until the key is found. Works on any array, O(n).'},
  {h:'Binary search',p:'On a <b>sorted</b> array, compare the key with the middle element and discard half the range each time. O(log n) comparisons. Sorting first is the price of fast lookups.'}],
 lab:'Sort and search visualizer',
 steps:['Read the array and keep a <b>comparison counter</b>.','<b>Bubble</b>: repeat passes, swap adjacent pairs when out of order, stop when a pass makes no swap.','<b>Selection</b>: for each position find the minimum of the rest and swap it in.','<b>Insertion</b>: take a[i], shift larger sorted elements right, drop a[i] in the gap.','<b>Merge / Quick</b>: divide, solve recursively, then merge or partition.','<b>Binary search</b>: set low and high, test mid, move low or high until found or low &gt; high.'],
 cplx:[['Bubble','O(n²) · best O(n)','Stable, in place'],['Selection','O(n²)','Not stable, in place, few swaps'],['Insertion','O(n²) · best O(n)','Stable, great for nearly sorted data'],['Merge','O(n log n)','Stable, O(n) extra space'],['Quick','O(n log n) avg · O(n²) worst','In place, not stable'],['Linear search','O(n)','Works unsorted'],['Binary search','O(log n)','Requires sorted data']],
 code:[{label:'exp7.c',src:R`#include <stdio.h>
#include <stdlib.h>

#define MAX 50

long comparisons;

void swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }

void bubbleSort(int a[], int n) {
    int i, j, swapped;
    for (i = 0; i < n - 1; i++) {
        swapped = 0;
        for (j = 0; j < n - i - 1; j++) {
            comparisons++;
            if (a[j] > a[j + 1]) { swap(&a[j], &a[j + 1]); swapped = 1; }
        }
        if (!swapped) break;                    /* already sorted */
    }
}

void selectionSort(int a[], int n) {
    int i, j, min;
    for (i = 0; i < n - 1; i++) {
        min = i;
        for (j = i + 1; j < n; j++) {
            comparisons++;
            if (a[j] < a[min]) min = j;
        }
        if (min != i) swap(&a[i], &a[min]);
    }
}

void insertionSort(int a[], int n) {
    int i, j, key;
    for (i = 1; i < n; i++) {
        key = a[i];
        j = i - 1;
        while (j >= 0 && (comparisons++, a[j] > key)) {
            a[j + 1] = a[j];
            j--;
        }
        a[j + 1] = key;
    }
}

void merge(int a[], int lo, int mid, int hi) {
    int tmp[MAX], i = lo, j = mid + 1, k = lo;
    while (i <= mid && j <= hi) {
        comparisons++;
        tmp[k++] = (a[i] <= a[j]) ? a[i++] : a[j++];
    }
    while (i <= mid) tmp[k++] = a[i++];
    while (j <= hi)  tmp[k++] = a[j++];
    for (k = lo; k <= hi; k++) a[k] = tmp[k];
}

void mergeSort(int a[], int lo, int hi) {
    int mid;
    if (lo >= hi) return;
    mid = (lo + hi) / 2;
    mergeSort(a, lo, mid);
    mergeSort(a, mid + 1, hi);
    merge(a, lo, mid, hi);
}

int partition(int a[], int lo, int hi) {
    int pivot = a[hi], i = lo - 1, j;
    for (j = lo; j < hi; j++) {
        comparisons++;
        if (a[j] < pivot) swap(&a[++i], &a[j]);
    }
    swap(&a[i + 1], &a[hi]);
    return i + 1;
}

void quickSort(int a[], int lo, int hi) {
    int p;
    if (lo < hi) {
        p = partition(a, lo, hi);
        quickSort(a, lo, p - 1);
        quickSort(a, p + 1, hi);
    }
}

int linearSearch(int a[], int n, int key) {
    int i;
    for (i = 0; i < n; i++) {
        comparisons++;
        if (a[i] == key) return i;
    }
    return -1;
}

int binarySearch(int a[], int n, int key) {     /* array must be sorted */
    int lo = 0, hi = n - 1, mid;
    while (lo <= hi) {
        mid = lo + (hi - lo) / 2;
        comparisons++;
        if (a[mid] == key) return mid;
        if (key < a[mid]) hi = mid - 1;
        else              lo = mid + 1;
    }
    return -1;
}

void display(int a[], int n) {
    int i;
    for (i = 0; i < n; i++) printf("%d ", a[i]);
    printf("\n");
}

int main(void) {
    int orig[MAX], a[MAX], n, i, ch, key, pos;
    printf("Number of elements (max %d): ", MAX);
    scanf("%d", &n);
    printf("Enter elements: ");
    for (i = 0; i < n; i++) scanf("%d", &orig[i]);

    do {
        printf("\n1.Bubble 2.Selection 3.Insertion 4.Merge 5.Quick\n");
        printf("6.Linear search 7.Binary search 0.Exit\nChoice: ");
        scanf("%d", &ch);
        for (i = 0; i < n; i++) a[i] = orig[i];
        comparisons = 0;
        switch (ch) {
        case 1: bubbleSort(a, n);        break;
        case 2: selectionSort(a, n);     break;
        case 3: insertionSort(a, n);     break;
        case 4: mergeSort(a, 0, n - 1);  break;
        case 5: quickSort(a, 0, n - 1);  break;
        case 6: case 7:
            printf("Key: "); scanf("%d", &key);
            if (ch == 7) quickSort(a, 0, n - 1);   /* sort before binary search */
            comparisons = 0;
            pos = (ch == 6) ? linearSearch(a, n, key) : binarySearch(a, n, key);
            if (pos >= 0) printf("Found at index %d", pos);
            else          printf("Not found");
            printf(" (%ld comparisons)\n", comparisons);
            continue;
        }
        if (ch >= 1 && ch <= 5) {
            printf("Sorted: "); display(a, n);
            printf("Comparisons: %ld\n", comparisons);
        }
    } while (ch != 0);
    return 0;
}
`}],
 viva:[['Which sorting algorithms are stable?','Bubble, insertion and merge sort are stable. Selection and quick sort (usual versions) are not.'],['Why is binary search faster than linear search?','It halves the search range each step, needing about log2(n) comparisons instead of up to n.'],['When does quick sort degrade to O(n²)?','When the pivot is always the smallest or largest element, such as already sorted input with a last-element pivot.'],['What is the best case of insertion sort?','O(n), when the array is already sorted: each element needs only one comparison.'],['Why does merge sort need extra space?','The merge step copies elements into a temporary array of size n.']]},

/* ------------------------------------------------------------------ 8 */
{id:'e8',no:8,short:'Hash Table',cat:'Hashing',cx:'Avg O(1) · Worst O(n)',
 title:'Hash Table Implementation',
 aim:'Implement a hash table using a hash function and handle collisions by separate chaining and by open addressing (linear probing).',
 concepts:[
  {h:'Hash function',p:'A hash function maps a key to an index in a table of size <code>m</code>. The division method uses <code>h(k) = k % m</code>. A good table size such as a prime number spreads keys evenly.'},
  {h:'Collisions',p:'Two keys can map to the same slot. That is a <b>collision</b>. The load factor <code>α = n / m</code> measures how full the table is. Collisions become more likely as α grows.'},
  {h:'Separate chaining',p:'Each slot holds a linked list of keys that hash to it. Insertion adds to the list. The table never fills up, but long chains slow lookups.'},
  {h:'Open addressing',p:'All keys live in the table array. On collision, probe for another free slot: <b>linear</b> uses <code>(h+i) % m</code>, <b>quadratic</b> uses <code>(h+i²) % m</code>. Deleted slots are marked with a tombstone so searches do not stop early.'}],
 lab:'Hash table visualizer',
 steps:['Choose the table size <b>m</b> and the hash function <b>k % m</b>.','<b>Insert (chaining)</b>: compute index, append a node to that list.','<b>Insert (linear probing)</b>: try slot h, then h+1, h+2 ... (wrap around) until an empty slot is found.','<b>Search</b>: follow the same probe sequence until the key is found or an empty slot ends the search.','<b>Delete</b>: remove the node (chaining) or mark the slot as deleted (probing).','Track the <b>load factor</b> and the number of collisions.'],
 cplx:[['Insert (average)','O(1)','With a good hash and low α'],['Search (average)','O(1 + α)','Chain length or probe length'],['Worst case','O(n)','All keys in one chain / cluster'],['Space','O(m + n)','Table plus nodes'],['Resizing','O(n)','Rehash all keys when α is high']],
 code:[
 {label:'chaining',src:R`#include <stdio.h>
#include <stdlib.h>

#define SIZE 7

struct node {
    int key;
    struct node *next;
};

struct node *table[SIZE];            /* array of list heads (all NULL) */

int hash(int key) { return key % SIZE; }

void insert(int key) {
    int i = hash(key);
    struct node *n = (struct node *)malloc(sizeof(struct node));
    n->key = key;
    n->next = table[i];              /* insert at the head of the chain */
    table[i] = n;
}

struct node *search(int key) {
    struct node *t = table[hash(key)];
    while (t != NULL && t->key != key)
        t = t->next;
    return t;
}

void delete(int key) {
    int i = hash(key);
    struct node *t = table[i], *prev = NULL;
    while (t != NULL && t->key != key) { prev = t; t = t->next; }
    if (t == NULL) { printf("%d not found\n", key); return; }
    if (prev == NULL) table[i] = t->next;
    else              prev->next = t->next;
    free(t);
}

void display(void) {
    int i;
    struct node *t;
    for (i = 0; i < SIZE; i++) {
        printf("[%d] ", i);
        for (t = table[i]; t != NULL; t = t->next)
            printf("-> %d ", t->key);
        printf("-> NULL\n");
    }
}

int main(void) {
    int ch, key;
    do {
        printf("\n1.Insert 2.Search 3.Delete 4.Display 0.Exit\nChoice: ");
        scanf("%d", &ch);
        switch (ch) {
        case 1: printf("Key: "); scanf("%d", &key); insert(key); break;
        case 2: printf("Key: "); scanf("%d", &key);
                printf(search(key) ? "Found\n" : "Not found\n"); break;
        case 3: printf("Key: "); scanf("%d", &key); delete(key); break;
        case 4: display(); break;
        }
    } while (ch != 0);
    return 0;
}
`},
 {label:'linear probing',src:R`#include <stdio.h>

#define SIZE 7
#define EMPTY   -1
#define DELETED -2

int table[SIZE];
int count = 0;

int hash(int key) { return key % SIZE; }

void init(void) {
    int i;
    for (i = 0; i < SIZE; i++) table[i] = EMPTY;
}

void insert(int key) {
    int i, idx;
    if (count == SIZE) { printf("Table is full\n"); return; }
    for (i = 0; i < SIZE; i++) {
        idx = (hash(key) + i) % SIZE;            /* linear probe */
        if (table[idx] == EMPTY || table[idx] == DELETED) {
            table[idx] = key;
            count++;
            if (i > 0) printf("Collision resolved after %d probe(s)\n", i);
            return;
        }
    }
}

int search(int key) {
    int i, idx;
    for (i = 0; i < SIZE; i++) {
        idx = (hash(key) + i) % SIZE;
        if (table[idx] == EMPTY) return -1;      /* chain ends here */
        if (table[idx] == key)   return idx;
    }
    return -1;
}

void delete(int key) {
    int idx = search(key);
    if (idx == -1) { printf("%d not found\n", key); return; }
    table[idx] = DELETED;                        /* tombstone */
    count--;
}

void display(void) {
    int i;
    for (i = 0; i < SIZE; i++) {
        if (table[i] == EMPTY)        printf("[%d] empty\n", i);
        else if (table[i] == DELETED) printf("[%d] deleted\n", i);
        else                          printf("[%d] %d\n", i, table[i]);
    }
    printf("Load factor = %.2f\n", (float)count / SIZE);
}

int main(void) {
    int ch, key, pos;
    init();
    do {
        printf("\n1.Insert 2.Search 3.Delete 4.Display 0.Exit\nChoice: ");
        scanf("%d", &ch);
        switch (ch) {
        case 1: printf("Key: "); scanf("%d", &key); insert(key); break;
        case 2: printf("Key: "); scanf("%d", &key);
                pos = search(key);
                if (pos >= 0) printf("Found at index %d\n", pos);
                else          printf("Not found\n");
                break;
        case 3: printf("Key: "); scanf("%d", &key); delete(key); break;
        case 4: display(); break;
        }
    } while (ch != 0);
    return 0;
}
`}],
 viva:[['What is a collision and how is it handled?','Two keys hashing to the same index. Handled by chaining (linked lists per slot) or open addressing (probing for another slot).'],['Why use a tombstone when deleting in open addressing?','Setting the slot to empty would break probe sequences of other keys that passed through it. A tombstone keeps the search going.'],['What is primary clustering?','In linear probing, runs of occupied slots grow and keep growing as new keys hash into them, increasing probe lengths. Quadratic probing reduces this.'],['What is the load factor and why does it matter?','α = n/m. Higher α means more collisions and slower operations. Tables are resized when α passes a limit such as 0.7.'],['Why is the table size usually a prime number?','It spreads keys more evenly with the modulo hash and avoids patterns when keys share common factors with m.']]}
];

const COMPARE=[
 ['Array','Index O(1)','Search O(n)','Insert/Delete O(n)','Fixed size, contiguous'],
 ['Singly linked list','Index O(n)','Search O(n)','Head O(1) · tail O(n)','Dynamic, extra pointer'],
 ['Stack (SLL)','Top O(1)','—','Push/Pop O(1)','LIFO'],
 ['Queue (array)','Front O(1)','—','Enqueue/Dequeue O(1)','FIFO, fixed capacity'],
 ['BST','—','Avg O(log n) · worst O(n)','Avg O(log n)','Ordered keys'],
 ['Graph traversal','—','BFS/DFS O(V+E)','—','Queue / stack'],
 ['Sorting','—','—','Basic O(n²) · merge/quick O(n log n)','Comparison based'],
 ['Hash table','—','Avg O(1)','Avg O(1)','Unordered, fast lookup']
];
