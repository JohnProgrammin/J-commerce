

        const cartButton = document.getElementById('cart-button');
        const closeCart = document.getElementById('close-cart');
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        const cartItemsContainer = document.getElementById('cart-items');
        const emptyCartMessage = document.getElementById('empty-cart-message');
        const cartCount = document.getElementById('cart-count');
        const cartSubtotal = document.getElementById('cart-subtotal');
        const cartTotal = document.getElementById('cart-total');
        const checkoutButton = document.getElementById('checkout-button');

    
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

       
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        cartButton.addEventListener('click', () => {
            cartSidebar.classList.remove('translate-x-full');
            cartOverlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });

        closeCart.addEventListener('click', () => {
            cartSidebar.classList.add('translate-x-full');
            cartOverlay.classList.add('hidden');
            document.body.style.overflow = 'auto';
        });

        cartOverlay.addEventListener('click', () => {
            cartSidebar.classList.add('translate-x-full');
            cartOverlay.classList.add('hidden');
            document.body.style.overflow = 'auto';
        });

    
        addToCartButtons.forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                const name = button.getAttribute('data-name');
                const price = parseFloat(button.getAttribute('data-price'));
                const image = button.getAttribute('data-image');
                
                
                const existingItem = cart.find(item => item.id === id);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({
                        id,
                        name,
                        price,
                        image,
                        quantity: 1
                    });
                }
                
               
                localStorage.setItem('cart', JSON.stringify(cart));
                
              
                updateCartUI();
                
                
                cartSidebar.classList.remove('translate-x-full');
                cartOverlay.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
                
                
                showNotification(`${name} added to cart!`);
            });
        });

        
        function updateCartUI() {
          
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
            
            
            cartItemsContainer.innerHTML = '';
            
            if (cart.length === 0) {
                emptyCartMessage.classList.remove('hidden');
                cartSubtotal.textContent = '$0.00';
                cartTotal.textContent = '$0.00';
                checkoutButton.disabled = true;
                checkoutButton.classList.add('opacity-50', 'cursor-not-allowed');
                return;
            }
            
            emptyCartMessage.classList.add('hidden');
            checkoutButton.disabled = false;
            checkoutButton.classList.remove('opacity-50', 'cursor-not-allowed');
            
            
            let subtotal = 0;
            
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;
                
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item';
                cartItemElement.innerHTML = `
                    <div class="flex items-center">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                        <div class="ml-4">
                            <h4 class="font-medium">${item.name}</h4>
                            <p class="text-primary font-semibold">$${item.price.toFixed(2)}</p>
                        </div>
                    </div>
                    <div class="flex items-center">
                        <div class="flex items-center border border-gray-300 rounded-lg">
                            <button class="decrease-quantity px-2 py-1 text-gray-600" data-id="${item.id}">-</button>
                            <span class="px-2">${item.quantity}</span>
                            <button class="increase-quantity px-2 py-1 text-gray-600" data-id="${item.id}">+</button>
                        </div>
                        <button class="remove-item ml-4 text-red-500" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                
                cartItemsContainer.appendChild(cartItemElement);
            });
            
    
            const shipping = 5.00;
            const total = subtotal + shipping;
            
            cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
            cartTotal.textContent = `$${total.toFixed(2)}`;
            
       
            document.querySelectorAll('.increase-quantity').forEach(button => {
                button.addEventListener('click', () => {
                    const id = button.getAttribute('data-id');
                    const item = cart.find(item => item.id === id);
                    item.quantity += 1;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartUI();
                });
            });
            
            document.querySelectorAll('.decrease-quantity').forEach(button => {
                button.addEventListener('click', () => {
                    const id = button.getAttribute('data-id');
                    const item = cart.find(item => item.id === id);
                    
                    if (item.quantity > 1) {
                        item.quantity -= 1;
                    } else {
                        cart = cart.filter(item => item.id !== id);
                    }
                    
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartUI();
                });
            });
            
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', () => {
                    const id = button.getAttribute('data-id');
                    cart = cart.filter(item => item.id !== id);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartUI();
                    showNotification('Item removed from cart');
                });
            });
        }

        checkoutButton.addEventListener('click', () => {
            alert('My checkout is under construction...');
        });

        function showNotification(message) {
            const notification = document.createElement('div');
            notification.className = 'fixed bottom-4 left-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg';
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        updateCartUI();
