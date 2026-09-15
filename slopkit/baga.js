Bagagwa Multi Chain Exploit. Rule of Thumb: DO NOT SUMMON BAGAGWA!

1. aio_multi_wait mode 0 â€” the UAF and the decrement

Syscall 663, body at 0xffffffff805c0210. The waiter array base is cached once in [rbx+0x40]; the loop walks it with add r14, 0x38. At the mode dispatch (0x805c078c):

â”Śâ”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ mode â”‚   entry    â”‚            node written             â”‚
â”śâ”€â”€â”€â”€â”€â”€â”Ľâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”Ľâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ 1    â”‚ 0x805c0798 â”‚ r14 = base + iÂ·0x38 âś“               â”‚
â”śâ”€â”€â”€â”€â”€â”€â”Ľâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”Ľâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ 2    â”‚ 0x805c084a â”‚ r14 âś“                               â”‚
â”śâ”€â”€â”€â”€â”€â”€â”Ľâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”Ľâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ 0    â”‚ 0x805c08e5 â”‚ rcx = [rbx+0x40] â€” always element 0 â”‚
â””â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”

With num â‰Ą 2, mode 0 links the same node onto N requests' waiter lists, overwriting node->owner (+0x18) each iteration. The cleanup loop at 0x805c0da1 unlinks by node->owner, so it only detaches from the last request â€” then 0x805c0f93 frees the array. Requests 0..N-2 keep req->waiters pointing into freed memory.

The waker at 0xffffffff805c1d2d is your write:

mov dword ptr [r15+0x20], eax   ; controlled 32-bit write
mov rdi, [r15+0x10]; add rdi,0x18; call mtx_lock   ; lock on a controlled pointer
mov rax, qword ptr [r15]
dec dword ptr [rax]             ; arbitrary 32-bit decrement
...
mov rax, qword ptr [r15 + 8]
test rax, rax
je  ...
dec dword ptr [rax]             ; and a second one

Mode 0 never initialises node->[8] (mode 2 does, at 0x805c089a), so it stays M_ZERO'd and is free for you to control post-free.

2. Why it's PS5-only

PS4 1352k's aio_multi_wait (0xffffffff8231f710) reads uap[0], uap[8], uap[0x10] and stops â€” 3 args, no mode. The entire multi-mode set_waiter machinery is new PS5 code. That resolves the constraint you kept restating.

3. Syscall 727 â€” the leak

get_aio_debug_request_info @ 0xffffffff805c3090, absent from t is bounded to [1, table->0x228] and req_id>>16 < 0x80, but inthe copy loop at 0x805c3325 the destination index is bounded by count while the source index is (req_id>>16) + edx scaled by 0x28 into [rax+0x20] â€” the slot index used as a bias into a different array. Each element leaks a dword at +0x20 and two 8-byte pointers to userland.

4. osem â€” the conversion

osem_delete @ 0x80e2632e:

test byte ptr [rbx + 0x45], 1
je   0x80e2635d          ; flag clear -> jump straight to the
                         ; never reading the refcount
...
dec dword ptr [rbx + 0x54]
jne  return
0x80e2635d: free(r14); free(rbx)

osem_open does inc [rax+0x54], osem_close does dec [rbx+0x54] and frees at zero. Refcount is a 32-bit field at obj+0x54 â€” exactly the width of the AIO decrement.

The zones line up precisely. The osem object is malloc(0x60, M_osem) at 0x80e26120 â€” 96 bytes, the 128 zone. The waiter array at num=2 is 0x70 â€” also the 128 zone; num=3/4 gives 0xA8/0xE0, the 256 zone. Same zones syscall 727 leaks addresses from.